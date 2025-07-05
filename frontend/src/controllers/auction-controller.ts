import { RtcPairSocket } from 'rtc-pair-socket';
import { AsyncQueue } from '@/utils/async-queue';
import generateProtocol from '@/utils/generate-protocol';
import assert from '@/utils/assert';

export const AuctionCallnameList = <const>['none', 'alice', 'bob', 'charlie', 'david'];
export type AuctionCallname = typeof AuctionCallnameList[number];
export type AuctionInput =  { a: number } | { b: number } | { c: number } | { d: number };

interface RtcPair {
  socket: RtcPairSocket;
  queue: AsyncQueue<unknown>;
  isConnected: boolean; // Add connection state tracking
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
  onProgress?: (progress: number) => void;

  constructor(network: AuctionNetwork, party: AuctionCallname, onProgress?: (progress: number) => void) {
    this.name = network.name;
    this.party = party;
    this.size = network.size;
    this.pairs = new Map();
    this.onProgress = onProgress;
    // Managable so manual coding it is
    // 2: 1
    // 3: 3
    // 4: 6
    const peerConfig = {
      iceServers: [
        { urls: 'stun:freestun.net:3478' },
        { urls: 'turn:freestun.net:3478', username: 'free', credential: 'free' }
      ]
    }
    switch (this.size) {
      case 2:
        const other = this.party === 'alice' ? 'bob' : 'alice';
        this.pairs.set(other, {
          socket: new RtcPairSocket(`${this.name}_alice_bob`, this.party as 'alice' | 'bob', {
            debug: 3,
            config: peerConfig
          }),
          queue: new AsyncQueue<unknown>(),
          isConnected: false
        });
        break;
      case 3:
        if (this.party === 'alice') {
          this.pairs.set('bob', {
            socket: new RtcPairSocket(`${this.name}_alice_bob`, 'alice'),
            queue: new AsyncQueue<unknown>(),
            isConnected: false
          });
          this.pairs.set('charlie', {
            socket: new RtcPairSocket(`${this.name}_alice_charlie`, 'alice'),
            queue: new AsyncQueue<unknown>(),
            isConnected: false
          });
        } else if (this.party === 'bob') {
          this.pairs.set('alice', {
            socket: new RtcPairSocket(`${this.name}_alice_bob`, 'bob'),
            queue: new AsyncQueue<unknown>(),
            isConnected: false
          });
          this.pairs.set('charlie', {
            socket: new RtcPairSocket(`${this.name}_bob_charlie`, 'alice'),
            queue: new AsyncQueue<unknown>(),
            isConnected: false
          });
        } else {
          this.pairs.set('bob', {
            socket: new RtcPairSocket(`${this.name}_bob_charlie`, 'bob'),
            queue: new AsyncQueue<unknown>(),
            isConnected: false
          });
          this.pairs.set('alice', {
            socket: new RtcPairSocket(`${this.name}_alice_charlie`, 'bob'),
            queue: new AsyncQueue<unknown>(),
            isConnected: false
          });
        }
        break;
      default:
        throw new Error("Unsupported network size");
    }
  }

  async connect() {
    // Set up message handlers first
    this.pairs.forEach((pair) => {
      pair.socket.on('message', (msg: unknown) => {
        pair.queue.push(msg);
      });
    });

    // Wait for all connections to be established
    await Promise.all(Array.from(this.pairs.entries()).map(([name, pair]) => 
      new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Connection timeout for ${name}`));
        }, 120000);

        pair.socket.on('open', () => {
          clearTimeout(timeout);
          pair.isConnected = true;
          resolve();
        });
        
        pair.socket.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });

        pair.socket.on('close', () => {
          pair.isConnected = false;
        });
      })
    ));

    // Verify all connections are ready
    const allConnected = Array.from(this.pairs.values()).every(pair => pair.isConnected);
    if (!allConnected) {
      throw new Error('Not all connections established successfully');
    }
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

  // Helper method to ensure connection is ready before sending
  private async ensureConnectionReady(pairName: AuctionCallname): Promise<void> {
    const pair = this.pairs.get(pairName);
    if (!pair) {
      throw new Error(`Unknown party: ${pairName}`);
    }

    if (!pair.isConnected) {
      // Wait for connection to be established
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Connection timeout for ${pairName}`));
        }, 120000);

        if (pair.isConnected) {
          clearTimeout(timeout);
          resolve();
          return;
        }

        const onOpen = () => {
          clearTimeout(timeout);
          pair.socket.off('open', onOpen);
          pair.socket.off('error', onError);
          pair.isConnected = true;
          resolve();
        };

        const onError = (error: Error) => {
          clearTimeout(timeout);
          pair.socket.off('open', onOpen);
          pair.socket.off('error', onError);
          reject(error);
        };

        pair.socket.on('open', onOpen);
        pair.socket.on('error', onError);
      });
    }
  }

  async mpcLargest(
    value: number,
  ): Promise<Record<string, unknown>> {
    const { party, pairs } = this;
    assert(party !== undefined, 'Party must be set');
    assert(pairs !== undefined, 'Pairs must be set');
    
    // Ensure all connections are ready before starting
    await Promise.all(Array.from(this.pairs.keys()).map(pairName => 
      this.ensureConnectionReady(pairName)
    ));

    let totalByteSent = 0;
    let totalByteReceived = 0;
    
    const protocol = await generateProtocol(this.size);
    const session = protocol.join(party, this.getInput(value), async (to, msg) => {
      totalByteSent += msg.byteLength;
      if (this.onProgress) {
        this.onProgress(Math.floor((totalByteSent + totalByteReceived) / 1024));
      }
      
      const pair = this.pairs.get(to as AuctionCallname);
      if (pair) {
        // Double-check connection is ready before sending
        if (!pair.isConnected) {
          await this.ensureConnectionReady(to as AuctionCallname);
        }
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
        if (this.onProgress) {
          this.onProgress(Math.floor((totalByteSent + totalByteReceived) / 1024));
        }
        session.handleMessage(other, msg);
      });
      streamHandlers.push(handler);
    });
    
    const output = await session.output();
    streamHandlers.forEach(handler => handler.stop());
    console.log(`auction: sent ${totalByteSent}, received ${totalByteReceived}, total ${totalByteSent + totalByteReceived}`);
    return output;
  }
}