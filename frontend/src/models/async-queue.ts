export interface QueueMessage<T> {
  id: string;
  type: 'push' | 'shift' | 'stream' | 'stop_stream';
  data?: T;
  streamId?: string;
}

export interface QueueResponse<T> {
  id: string;
  type: 'shift_result' | 'stream_data' | 'error';
  data?: T;
  error?: string;
  streamId?: string;
}