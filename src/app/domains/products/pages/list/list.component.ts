import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { ProductComponent } from '@products/components/product/product.component';
import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { CATALOG_SOURCE } from '@shared/data-sources/catalog-source.token';
import { ToastService } from '@shared/services/toast.service';
import { LoadState, toLoadState } from '@shared/utils/load-state';

@Component({
  selector: 'app-list',
  imports: [ProductComponent, RouterLink, RouterLinkActive],
  templateUrl: './list.component.html',
})
export default class ListComponent {
  private readonly cartService = inject(CartService);
  private readonly catalog = inject(CATALOG_SOURCE);
  private readonly toast = inject(ToastService);

  /** Parámetro de ruta `/category/:slug`. */
  readonly slug = input<string>();
  /** Query param `?q=` del buscador. */
  readonly q = input<string>();

  readonly skeletons = Array.from({ length: 8 }, (_, i) => i);

  readonly categories = toSignal(this.catalog.getCategories(), {
    initialValue: [],
  });

  readonly searchTerm = computed(() => this.q()?.trim() ?? '');

  readonly currentCategory = computed(() =>
    this.categories().find(category => category.slug === this.slug())
  );

  private readonly retry = signal(0);

  private readonly state = toSignal(
    combineLatest([
      toObservable(this.slug),
      toObservable(this.searchTerm),
      toObservable(this.retry),
    ]).pipe(
      switchMap(([categorySlug, title]) =>
        this.catalog.getProducts({ categorySlug, title }).pipe(toLoadState())
      )
    ),
    { initialValue: { status: 'loading' } as LoadState<Product[]> }
  );

  readonly loading = computed(() => this.state().status === 'loading');
  readonly error = computed(() => this.state().status === 'error');
  readonly products = computed(() => {
    const state = this.state();
    return state.status === 'success' ? state.data : [];
  });

  readonly heading = computed(
    () => this.currentCategory()?.name ?? 'Todos los productos'
  );

  reload() {
    this.retry.update(n => n + 1);
  }

  addToCart(product: Product) {
    this.cartService.add(product);
    this.toast.show(`“${product.title}” se agregó al carrito`);
  }
}
