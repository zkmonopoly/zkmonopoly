import { EventEmitter } from 'ee-typed';
import Peer, { DataConnection, PeerOptions } from 'peerjs';
import { Key } from "rtc-pair-socket";

type Events = {
  open(): void;
  close(): void;
  message(data: unknown): void;
  error(err: Error): void;
};

export class UnsecuredRtcPairSocket extends EventEmitter<Events> {
  private conn?: DataConnection;
  private closed = false;
  private alicePeerId: string;
  private bobPeerId: string;
  private peerId: string;
  private peer: Peer;

  constructor(
    readonly pairingCode: string,
    readonly party: 'alice' | 'bob',
    readonly peerOptions?: PeerOptions,
  ) {
    super();

    if ('iceServers' in ((peerOptions ?? {}) as any)) {
      throw new Error([
        'The third argument to RtcPairSocket changed in 0.2.0.',
        ' Please supply PeerOptions (PeerJS) instead of RTCConfiguration.'
      ].join(''));
    }
    const key = Key.fromSeed(pairingCode);

    const idPrefix = `rtc-pair-socket-${Key.fromSeed(key.data).base58()}`;
    this.alicePeerId = `${idPrefix}-alice`;
    this.bobPeerId = `${idPrefix}-bob`;
    this.peerId = party === 'alice' ? this.alicePeerId : this.bobPeerId;
    this.peer = new Peer(this.peerId, this.peerOptions);

    this.connect().catch((err) => this.emit('error', ensureError(err)));
  }

  private async connect() {
    await new Promise((resolve, reject) => {
      this.peer.on('open', resolve);
      this.peer.on('error', reject);
    });

    let conn: DataConnection;

    if (this.party === 'alice') {
      const connPromise = new Promise<DataConnection>(
        resolve => this.peer.on('connection', resolve),
      );

      const notifyConn = this.peer.connect(this.bobPeerId);
      notifyConn.on('open', () => notifyConn.close());

      conn = await connPromise;
    } else {
      conn = this.peer.connect(this.alicePeerId, { reliable: true });

      await new Promise<void>((resolve, reject) => {
        conn.on('open', resolve);
        conn.on('error', reject);

        this.peer.on('connection', (notifyConn) => {
          notifyConn.close();
          conn.close();

          conn = this.peer.connect(this.alicePeerId, { reliable: true });
          conn.on('open', resolve);
          conn.on('error', reject);
        });
      });
    }

    if (this.closed) {
      conn.close();
      return;
    }

    this.conn = conn;

    conn.on('data', (data) => {
      let buf: Uint8Array;

      if (data instanceof ArrayBuffer) {
        buf = new Uint8Array(data);
      } else if (data instanceof Uint8Array) {
        buf = data;
      } else {
        this.emit('error', new Error('Received unrecognized data type'));
        return;
      }

      this.emit('message', buf);
    });

    conn.on('error', (err) => {
      this.emit('error', err);
    });

    conn.on('close', () => {
      this.close();
    });

    if (!conn.reliable) {
      // covers the unlikely case where the other side used reliable: false
      conn.close();
      throw new Error('Connection is not reliable');
    }

    this.emit('open');
  }

  send(data: unknown) {
    if (!this.conn) {
      throw new Error('Connection not established');
    }

    this.conn.send(data);
  }

  close() {
    if (!this.closed) {
      this.conn?.close();
      this.conn = undefined;
      this.peer.destroy();
      this.closed = true;
      this.emit('close');
    }
  }

  isClosed() {
    return this.closed;
  }
}

function ensureError(err: any): Error {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}