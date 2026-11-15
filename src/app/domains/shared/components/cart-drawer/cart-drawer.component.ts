import { CurrencyPipe, DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';
import { CartService } from '@shared/services/cart.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-cart-drawer',
  imports: [CurrencyPipe, RouterLink, ImgFallbackDirective],
  templateUrl: './cart-drawer.component.html',
})
export class CartDrawerComponent {
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly document = inject(DOCUMENT);
  private readonly closeButton =
    viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  readonly items = this.cart.items;
  readonly count = this.cart.count;
  readonly total = this.cart.total;
  readonly isOpen = this.cart.isOpen;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      // Evita el scroll del fondo y lleva el foco al panel al abrirlo.
      this.document.body.classList.toggle('overflow-hidden', open);
      if (open) {
        setTimeout(() => this.closeButton().nativeElement.focus());
      }
    });
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
    this.cart.clear();
    this.close();
    this.toast.show('¡Gracias por tu compra! (pedido de demostración)');
  }
}
