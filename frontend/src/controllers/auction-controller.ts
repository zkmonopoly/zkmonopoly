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
    switch (this.size) {
      case 2:
        const other = this.party === 'alice' ? 'bob' : 'alice';
        this.pairs.set(other, {
          socket: new RtcPairSocket(`${this.name}_alice_bob`, this.party as 'alice' | 'bob'),
          queue: new AsyncQueue<unknown>()
        });
        break;
      case 3:
        if (this.party === 'alice') {
          this.pairs.set('bob', {
            socket: new RtcPairSocket(`${this.name}_alice_bob`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('charlie', {
            socket: new RtcPairSocket(`${this.name}_alice_charlie`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
        } else if (this.party === 'bob') {
          this.pairs.set('alice', {
            socket: new RtcPairSocket(`${this.name}_alice_bob`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('charlie', {
            socket: new RtcPairSocket(`${this.name}_bob_charlie`, 'alice'),
            queue: new AsyncQueue<unknown>()
          });
        } else {
          this.pairs.set('bob', {
            socket: new RtcPairSocket(`${this.name}_bob_charlie`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
          this.pairs.set('alice', {
            socket: new RtcPairSocket(`${this.name}_alice_charlie`, 'bob'),
            queue: new AsyncQueue<unknown>()
          });
        }
        break;
      default:
        throw new Error("Unsupported network size");
    }
  }

  async connect() {
    this.pairs.forEach((pair) => {
      pair.socket.on('message', (msg: unknown) => {
        pair.queue.push(msg);
      });
    });

    await Promise.all(Array.from(this.pairs.values()).map((pair) => 
      new Promise<void>((resolve, reject) => {
        pair.socket.on('open', resolve);
        pair.socket.on('error', reject);
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
    
    const protocol = await generateProtocol(this.size);
    const session = protocol.join(party, this.getInput(value), (to, msg) => {
      totalByteSent += msg.byteLength;
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
      pair.queue.stream((msg) => {
        if (!(msg instanceof Uint8Array)) {
          throw new Error('Unexpected message type');
        }
        totalByteSent += msg.byteLength;
        if (this.onProgress) {
          this.onProgress(Math.floor(totalByteSent / 1024));
        }
        session.handleMessage(other, msg);
      })
    });
    const output = await session.output();
    streamHandlers.forEach(handler => handler.stop());
    console.log(`auction: ${totalByteSent}`);
    return output;
  }
}