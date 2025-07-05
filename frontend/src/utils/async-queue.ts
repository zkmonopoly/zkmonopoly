export class AsyncQueue<T> {
  messages: T[] = [];
  pendingResolves: ((msg: T) => void)[] = [];

  push(msg: T) {
    if (this.pendingResolves.length > 0) {
      const pendingResolve = this.pendingResolves.shift()!;
      pendingResolve(msg);
      return;
    }

    this.messages.push(msg);
  }

  async shift(abortSignal?: AbortSignal): Promise<T> {
    if (this.messages.length > 0) {
      return this.messages.shift()!;
    }

    return new Promise((resolve, reject) => {
      if (abortSignal?.aborted) {
        reject(new Error('Stream stopped'));
        return;
      }

      const onAbort = () => {
        this.pendingResolves = this.pendingResolves.filter(r => r !== resolve);
        abortSignal?.removeEventListener('abort', onAbort);
        reject(new Error('Stream stopped'));
      };

      abortSignal?.addEventListener('abort', onAbort);

      this.pendingResolves.push((msg: T) => {
        abortSignal?.removeEventListener('abort', onAbort);
        resolve(msg);
      });
    });
  }

  stream(handler: (msg: T) => void) {
    const abortController = new AbortController();
    const { signal } = abortController;

    const loop = async () => {
      while (!signal.aborted) {
        try {
          const msg = await this.shift(signal);
          handler(msg);
        } catch (err) {
          if (err instanceof Error && err.message === 'Stream stopped') {
            // Exit the loop gracefully
            break;
          } else {
            // Handle other potential errors
            console.error('AsyncQueue stream error:', err);
            break;
          }
        }
      }
    };

    // Start the loop but don't await it (fire and forget is intentional here)
    loop().catch(err => {
      console.error('AsyncQueue stream loop error:', err);
    });

    return {
      stop() {
        abortController.abort();
      },
    };
  }
}