import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs';
import { SearchComponent } from '@shared/components/search/search.component';
import { CartService } from '@shared/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, SearchComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);

  readonly cartCount = this.cartService.count;
  readonly menuOpen = signal(false);

  readonly links = [
    { label: 'Productos', path: '/', exact: true },
    { label: 'Sobre el proyecto', path: '/about', exact: false },
  ];

  constructor() {
    // Cierra el menú móvil al navegar.
    inject(Router)
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }

  openCart() {
    this.cartService.open();
  }
}
