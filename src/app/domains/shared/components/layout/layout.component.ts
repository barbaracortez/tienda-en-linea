import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartDrawerComponent } from '@shared/components/cart-drawer/cart-drawer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { ToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, HeaderComponent, CartDrawerComponent, ToastComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  readonly year = new Date().getFullYear();
}
