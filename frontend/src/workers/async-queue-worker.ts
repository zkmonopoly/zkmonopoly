import { QueueResponse, QueueMessage } from "@/models/async-queue";

// worker.ts - WebWorker script
class AsyncQueueWorker<T> {
  messages: T[] = [];
  pendingResolves: Map<string, (msg: T) => void> = new Map();
  streams: Map<string, boolean> = new Map();

  push(msg: T) {
    if (this.pendingResolves.size > 0) {
      const firstId = this.pendingResolves.keys().next().value!;
      const resolve = this.pendingResolves.get(firstId)!;
      this.pendingResolves.delete(firstId);
      resolve(msg);
      return;
    }

    this.messages.push(msg);
    
    // Notify active streams
    for (const [streamId, active] of this.streams) {
      if (active && this.messages.length > 0) {
        const streamMsg = this.messages.shift()!;
        self.postMessage({
          id: '',
          type: 'stream_data',
          data: streamMsg,
          streamId
        } as QueueResponse<T>);
      }
    }
  }

  shift(id: string): T | null {
    if (this.messages.length > 0) {
      return this.messages.shift()!;
    }

    // Store the resolve function for later
    this.pendingResolves.set(id, (msg: T) => {
      self.postMessage({
        id,
        type: 'shift_result',
        data: msg
      } as QueueResponse<T>);
    });

    return null;
  }

  startStream(streamId: string) {
    this.streams.set(streamId, true);
    
    // Process any existing messages
    while (this.messages.length > 0 && this.streams.get(streamId)) {
      const msg = this.messages.shift()!;
      self.postMessage({
        id: '',
        type: 'stream_data',
        data: msg,
        streamId
      } as QueueResponse<T>);
    }
  }

  stopStream(streamId: string) {
    this.streams.delete(streamId);
  }
}

const queue = new AsyncQueueWorker<any>();

self.onmessage = (e: MessageEvent<QueueMessage<any>>) => {
  const { id, type, data, streamId } = e.data;

  try {
    switch (type) {
      case 'push':
        queue.push(data);
        break;

      case 'shift':
        const result = queue.shift(id);
        if (result !== null) {
          self.postMessage({
            id,
            type: 'shift_result',
            data: result
          } as QueueResponse<any>);
        }
        break;

      case 'stream':
        if (streamId) {
          queue.startStream(streamId);
        }
        break;

      case 'stop_stream':
        if (streamId) {
          queue.stopStream(streamId);
        }
        break;
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as QueueResponse<any>);
  }
};