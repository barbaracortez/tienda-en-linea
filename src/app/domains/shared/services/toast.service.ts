import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);
  private timeoutId?: ReturnType<typeof setTimeout>;

  show(message: string, duration = 2500) {
    clearTimeout(this.timeoutId);
    this.message.set(message);
    this.timeoutId = setTimeout(() => this.message.set(null), duration);
  }

  dismiss() {
    clearTimeout(this.timeoutId);
    this.message.set(null);
  }
}
