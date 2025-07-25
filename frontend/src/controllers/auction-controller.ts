import { RtcPairSocket } from 'rtc-pair-socket';
import { AsyncQueue } from '@/utils/async-queue';
import generateProtocol from '@/utils/generate-protocol';
import assert from '@/utils/assert';
import { $connectionStatus, $dataCount } from '@/models/auction';

export const AuctionCallnameList = <const>['none', 'alice', 'bob', 'charlie', 'david'];
export type AuctionCallname = typeof AuctionCallnameList[number];
export type AuctionInput =  { a: number } | { b: number } | { c: number } | { d: number };

interface RtcPair {
  socket: RtcPairSocket;
  queue: AsyncQueue<unknown>;
}

export interface AuctionNetwork {
  name: string;
  size: number;
}

export default class AuctionController {
  name: string;
  size: number;
  pairs: Map<AuctionCallname, RtcPair>;
  party: AuctionCallname;
  minValue: number;

  constructor(network: AuctionNetwork, party: AuctionCallname, minValue: number, onProgress?: (progress: number) => void) {
    this.name = network.name;
    this.party = party;
    this.size = network.size;
    this.pairs = new Map();
    this.minValue = minValue;
    // Managable so manual coding it is
    // 2: 1
    // 3: 3
    // 4: 6
    switch (this.size) {
      case 2:
        const other = this.party === 'alice' ? 'bob' : 'alice';
        this.pairs.set(other, {
          socket: this.createSocket(`${this.name}_alice_bob`, this.party as 'alice' | 'bob'),
          queue: new AsyncQueue<unknown>()
        });
        break;
      case 3:
        if (this.party === 'alice') {
          this.pairs.set('bob', {
            socket: this.createSocket(`${this.name}_alice_bob`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('charlie', {
            socket: this.createSocket(`${this.name}_alice_charlie`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
        } else if (this.party === 'bob') {
          this.pairs.set('alice', {
            socket: this.createSocket(`${this.name}_alice_bob`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('charlie', {
            socket: this.createSocket(`${this.name}_bob_charlie`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
        } else {
          this.pairs.set('bob', {
            socket: this.createSocket(`${this.name}_bob_charlie`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('alice', {
            socket: this.createSocket(`${this.name}_alice_charlie`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
        }
        break;
      case 4:
        if (this.party === 'alice') {
          this.pairs.set('bob', {
            socket: this.createSocket(`${this.name}_alice_bob`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('charlie', {
            socket: this.createSocket(`${this.name}_alice_charlie`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('david', {
            socket: this.createSocket(`${this.name}_alice_david`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
        } else if (this.party === 'bob') {
          this.pairs.set('alice', {
            socket: this.createSocket(`${this.name}_alice_bob`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('charlie', {
            socket: this.createSocket(`${this.name}_bob_charlie`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('david', {
            socket: this.createSocket(`${this.name}_bob_david`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
        } else if (this.party === 'charlie') {
          this.pairs.set('alice', {
            socket: this.createSocket(`${this.name}_alice_charlie`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('bob', {
            socket: this.createSocket(`${this.name}_bob_charlie`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('david', {
            socket: this.createSocket(`${this.name}_charlie_david`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
        } else {
          this.pairs.set('alice', {
            socket: this.createSocket(`${this.name}_alice_david`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('bob', {
            socket: this.createSocket(`${this.name}_bob_david`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('charlie', {
            socket: this.createSocket(`${this.name}_charlie_david`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
        }
        break;
      default:
        throw new Error("Unsupported network size");
    }
  }

  private createSocket(pairingCode: string, role: 'alice' | 'bob') {
    const peerConfig = {
      iceServers: [
        { urls: 'stun:103.186.65.202:3478' },
        { urls: 'turn:103.186.65.202:3478?transport=tcp', username: 'zkmonopoly', credential: '7GhW6VK0t44f' }
      ]
    };
    return new RtcPairSocket(pairingCode, role, peerConfig);
  }

  private async connect() {
    // Wait for all connections to be established
    await Promise.all(Array.from(this.pairs.entries()).map(([name, pair]) => 
      new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Connection timeout for ${name}`));
        }, 120000);

        pair.socket.on('open', () => {
          clearTimeout(timeout);
          pair.socket.removeAllListeners('message');
          pair.socket.on('message', (msg: unknown) => {
            pair.queue.push(msg);
          });
          resolve();
        });
        
        pair.socket.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      })
    ));
  }

  private getInput(value: number): AuctionInput  {
    return this.party === 'alice' ?
      { a: value } : (
        this.party === 'bob' ?
        { b: value } : (
          this.party === 'charlie' ? { c: value } : { d: value }
        )
      );
  }

  async mpcLargest(
    value: number,
  ): Promise<Record<string, unknown>> {
    const { party, pairs } = this;
    assert(party !== undefined, 'Party must be set');
    assert(pairs !== undefined, 'Pairs must be set');

    let totalByteSent = 0;
    let totalByteReceived = 0;

    $connectionStatus.set("connecting");
    await this.connect();
    
    const protocol = await generateProtocol(this.size, this.minValue);

    const session = protocol.join(party, this.getInput(value), (to, msg) => {
      totalByteSent += msg.byteLength;
      // if (this.onProgress) {
      //   this.onProgress(Math.floor((totalByteSent + totalByteReceived) / 1024));
      // }
      const pair = this.pairs.get(to as AuctionCallname);
      if (pair) {
        pair.socket.send(msg);
      } else {
        throw new Error("Unknown party");
      }
    });
    
    type StreamHandler = {
      stop: () => void;
    }
    const streamHandlers: StreamHandler[] = [];
    this.pairs.forEach((pair, other) => {
      const handler = pair.queue.stream((msg) => {
        if (!(msg instanceof Uint8Array)) {
          throw new Error('Unexpected message type');
        }
        totalByteReceived += msg.byteLength;
        // if (this.onProgress) {
        //   this.onProgress(Math.floor((totalByteSent + totalByteReceived) / 1024));
        // }
        session.handleMessage(other, msg);
      });
      streamHandlers.push(handler);
    });
    $connectionStatus.set("in-progress");
    const output = await session.output();
    $dataCount.set(Math.floor((totalByteReceived + totalByteSent) / 1024));
    $connectionStatus.set("completed");
    streamHandlers.forEach(handler => handler.stop());
    console.log(`auction: sent ${totalByteSent}, received ${totalByteReceived}, total ${totalByteSent + totalByteReceived}`);
    return output;
  }
}