import { CurrencyPipe, DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';
import { CartService } from '@shared/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  imports: [CurrencyPipe, RouterLink, ImgFallbackDirective],
  templateUrl: './cart-drawer.component.html',
})
export class CartDrawerComponent {
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly closeButton =
    viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  readonly items = this.cart.items;
  readonly count = this.cart.count;
  readonly total = this.cart.total;
  readonly isOpen = this.cart.isOpen;

  /** Elemento que tenía el foco antes de abrir, para devolvérselo al cerrar. */
  private returnFocusTo: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      // Evita el scroll del fondo y maneja el foco como un diálogo modal.
      this.document.body.classList.toggle('overflow-hidden', open);
      if (open) {
        this.returnFocusTo = this.document.activeElement as HTMLElement | null;
        setTimeout(() => this.closeButton().nativeElement.focus());
      } else if (this.returnFocusTo) {
        const target = this.returnFocusTo;
        this.returnFocusTo = null;
        setTimeout(() => target.focus());
      }
    });
  }

  /** Mantiene el foco dentro del panel mientras está abierto. */
  trapFocus(event: KeyboardEvent) {
    if (event.key !== 'Tab') {
      return;
    }
    const panel = event.currentTarget as HTMLElement;
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.close();
    }
  }

  close() {
    this.cart.close();
  }

  increase(productId: number, quantity: number) {
    this.cart.updateQuantity(productId, quantity + 1);
  }

  decrease(productId: number, quantity: number) {
    this.cart.updateQuantity(productId, quantity - 1);
  }

  remove(productId: number) {
    this.cart.remove(productId);
  }

  clear() {
    this.cart.clear();
  }

  checkout() {
    this.close();
    this.router.navigate(['/checkout']);
  }
}
