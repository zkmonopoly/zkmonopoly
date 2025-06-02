import { QueueResponse, QueueMessage } from "@/models/async-queue";
import AsyncQueueWorker from "@/workers/async-queue-worker?worker";

export class AsyncQueue<T> {
  private worker: Worker;
  private pendingShifts: Map<string, {
    resolve: (value: T) => void;
    reject: (error: Error) => void;
    abortController?: AbortController;
  }> = new Map();
  private streams: Map<string, {
    handler: (msg: T) => void;
    abortController: AbortController;
  }> = new Map();
  private messageId = 0;

  constructor() {
    this.worker = new AsyncQueueWorker();
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    this.worker.onerror = this.handleWorkerError.bind(this);
  }

  private generateId(): string {
    return `${++this.messageId}`;
  }

  private handleWorkerMessage(e: MessageEvent<QueueResponse<T>>) {
    const { id, type, data, error, streamId } = e.data;

    switch (type) {
      case 'shift_result':
        const pendingShift = this.pendingShifts.get(id);
        if (pendingShift) {
          this.pendingShifts.delete(id);
          pendingShift.resolve(data!);
        }
        break;

      case 'stream_data':
        if (streamId) {
          const stream = this.streams.get(streamId);
          if (stream && !stream.abortController.signal.aborted) {
            stream.handler(data!);
          }
        }
        break;

      case 'error':
        if (id) {
          const pendingShift = this.pendingShifts.get(id);
          if (pendingShift) {
            this.pendingShifts.delete(id);
            pendingShift.reject(new Error(error || 'Worker error'));
          }
        }
        break;
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
    // Reject all pending operations
    for (const [_, pending] of this.pendingShifts) {
      pending.reject(new Error('Worker error'));
    }
    this.pendingShifts.clear();
  }

  push(msg: T): void {
    this.worker.postMessage({
      id: this.generateId(),
      type: 'push',
      data: msg
    } as QueueMessage<T>);
  }

  async shift(abortSignal?: AbortSignal): Promise<T> {
    const id = this.generateId();

    return new Promise<T>((resolve, reject) => {
      if (abortSignal?.aborted) {
        reject(new Error('Stream stopped'));
        return;
      }

      const abortController = new AbortController();
      
      const onAbort = () => {
        this.pendingShifts.delete(id);
        abortSignal?.removeEventListener('abort', onAbort);
        reject(new Error('Stream stopped'));
      };

      abortSignal?.addEventListener('abort', onAbort);

      this.pendingShifts.set(id, {
        resolve: (value: T) => {
          abortSignal?.removeEventListener('abort', onAbort);
          resolve(value);
        },
        reject,
        abortController
      });

      this.worker.postMessage({
        id,
        type: 'shift'
      } as QueueMessage<T>);
    });
  }

  stream(handler: (msg: T) => void) {
    const streamId = this.generateId();
    const abortController = new AbortController();

    this.streams.set(streamId, {
      handler,
      abortController
    });

    this.worker.postMessage({
      id: this.generateId(),
      type: 'stream',
      streamId
    } as QueueMessage<T>);

    return {
      stop: () => {
        abortController.abort();
        this.streams.delete(streamId);
        this.worker.postMessage({
          id: this.generateId(),
          type: 'stop_stream',
          streamId
        } as QueueMessage<T>);
      }
    };
  }

  terminate(): void {
    this.worker.terminate();
    this.pendingShifts.clear();
    this.streams.clear();
  }
}