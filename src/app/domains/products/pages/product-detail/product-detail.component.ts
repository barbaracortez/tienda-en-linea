import { CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { combineLatest, switchMap, tap } from 'rxjs';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';
import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { CATALOG_SOURCE } from '@shared/data-sources/catalog-source.token';
import { ToastService } from '@shared/services/toast.service';
import { LoadState, toLoadState } from '@shared/utils/load-state';
import { pageTitle } from '@shared/utils/title';

const MAX_QUANTITY = 10;

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, ImgFallbackDirective],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent {
  private readonly catalog = inject(CATALOG_SOURCE);
  private readonly cartService = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly title = inject(Title);

  /** Parámetro de ruta `/product/:slug`. */
  readonly slug = input.required<string>();

  readonly maxQuantity = MAX_QUANTITY;
  readonly quantity = signal(1);
  private readonly selectedImage = signal<string | null>(null);
  private readonly retry = signal(0);

  private readonly state = toSignal(
    combineLatest([toObservable(this.slug), toObservable(this.retry)]).pipe(
      tap(() => {
        this.selectedImage.set(null);
        this.quantity.set(1);
      }),
      switchMap(([slug]) =>
        this.catalog.getProductBySlug(slug).pipe(toLoadState())
      )
    ),
    { initialValue: { status: 'loading' } as LoadState<Product> }
  );

  readonly loading = computed(() => this.state().status === 'loading');
  readonly error = computed(() => this.state().status === 'error');
  readonly product = computed(() => {
    const state = this.state();
    return state.status === 'success' ? state.data : null;
  });
  readonly cover = computed(
    () => this.selectedImage() ?? this.product()?.images[0] ?? ''
  );

  constructor() {
    effect(() => {
      const product = this.product();
      if (product) {
        this.title.setTitle(pageTitle(product.title));
      } else if (this.error()) {
        this.title.setTitle(pageTitle('Producto no encontrado'));
      }
    });
  }

  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  increase() {
    this.quantity.update(q => Math.min(q + 1, MAX_QUANTITY));
  }

  decrease() {
    this.quantity.update(q => Math.max(q - 1, 1));
  }

  reload() {
    this.retry.update(n => n + 1);
  }

  addToCart() {
    const product = this.product();
    if (!product) {
      return;
    }
    this.cartService.add(product, this.quantity());
    this.toast.show(`“${product.title}” se agregó al carrito`);
  }

  buyNow() {
    this.addToCart();
    this.cartService.open();
  }
}
