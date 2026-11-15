import { Component, inject } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div
      class="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      role="status"
      aria-live="polite">
      @if (message(); as text) {
        <div
          class="pointer-events-auto flex items-center gap-3 rounded-lg border border-nightBorder bg-nightLight px-4 py-3 text-sm shadow-soft">
          <span
            class="h-2 w-2 rounded-full bg-emerald-400"
            aria-hidden="true"></span>
          <span>{{ text }}</span>
          <button
            type="button"
            class="ml-2 text-slate-400 hover:text-white"
            (click)="dismiss()"
            aria-label="Cerrar notificación">
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  private readonly toast = inject(ToastService);
  readonly message = this.toast.message;

  dismiss() {
    this.toast.dismiss();
  }
}
