import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartDrawerComponent } from '@shared/components/cart-drawer/cart-drawer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { ToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    HeaderComponent,
    CartDrawerComponent,
    ToastComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  readonly year = new Date().getFullYear();
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  /** Enlace de salto para teclado: evita recorrer todo el header. */
  skipToContent() {
    this.main().nativeElement.focus();
  }
}
