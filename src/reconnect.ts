export interface ReconnectConfig {
  enabled: boolean;
  /** Base delay in ms (default: 1000) */
  baseDelay?: number;
  /** Maximum delay in ms (default: 30000) */
  maxDelay?: number;
  /** Maximum number of reconnect attempts (default: Infinity) */
  maxAttempts?: number;
}

export class ReconnectController {
  private baseDelay: number;
  private maxDelay: number;
  private maxAttempts: number;
  private attempt = 0;
  private aborted = false;
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: ReconnectConfig) {
    this.baseDelay = config.baseDelay ?? 1000;
    this.maxDelay = config.maxDelay ?? 30000;
    this.maxAttempts = config.maxAttempts ?? Infinity;
  }

  nextDelay(): number | null {
    if (this.aborted || this.attempt >= this.maxAttempts) return null;
    const exponential = Math.min(
      this.baseDelay * Math.pow(2, this.attempt),
      this.maxDelay,
    );
    // Jitter: random between 50%-100% of the exponential value
    const jitter = 0.5 + Math.random() * 0.5;
    this.attempt++;
    return Math.round(exponential * jitter);
  }

  schedule(): Promise<void> {
    const delay = this.nextDelay();
    if (delay === null) return Promise.reject(new Error('Max reconnect attempts exceeded'));
    return new Promise((resolve, reject) => {
      this.pendingTimer = setTimeout(() => {
        this.pendingTimer = null;
        if (this.aborted) {
          reject(new Error('Reconnect aborted'));
        } else {
          resolve();
        }
      }, delay);
    });
  }

  reset(): void {
    this.attempt = 0;
    this.aborted = false;
  }

  abort(): void {
    this.aborted = true;
    if (this.pendingTimer !== null) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
  }

  canRetry(): boolean {
    return !this.aborted && this.attempt < this.maxAttempts;
  }
}
