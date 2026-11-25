import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { combineLatest, switchMap, tap } from 'rxjs';
import {
  IMAGE_PLACEHOLDER,
  ImgFallbackDirective,
} from '@shared/directives/img-fallback.directive';
import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { CATALOG_SOURCE } from '@shared/data-sources/catalog-source.token';
import { ToastService } from '@shared/services/toast.service';
import { LoadState, toLoadState } from '@shared/utils/load-state';
import { productImageLoader } from '@shared/utils/image-loader';
import { SeoService, truncate } from '@shared/utils/title';

const MAX_QUANTITY = 10;

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink, ImgFallbackDirective],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent {
  private readonly catalog = inject(CATALOG_SOURCE);
  private readonly cartService = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly seo = inject(SeoService);

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
    () => this.selectedImage() ?? this.product()?.images[0] ?? IMAGE_PLACEHOLDER
  );
  readonly coverAlt = computed(() => {
    const product = this.product();
    if (!product) {
      return '';
    }
    const index = product.images.indexOf(this.cover()) + 1;
    return index > 1
      ? `${product.title}, vista de detalle ${index} de ${product.images.length}`
      : product.title;
  });

  constructor() {
    effect(() => {
      const product = this.product();
      if (product) {
        this.seo.update({
          title: product.title,
          description: truncate(product.description),
        });
      } else if (this.error()) {
        this.seo.update({ title: 'Producto no encontrado' });
      }
    });
  }

  /** Variante chica de la foto para las miniaturas de la galería. */
  thumbnail(image: string): string {
    return productImageLoader({ src: image, width: 200 });
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
