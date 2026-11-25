import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IMAGE_PLACEHOLDER,
  ImgFallbackDirective,
} from '@shared/directives/img-fallback.directive';
import { Product } from '@shared/models/product.model';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, RouterLink, NgOptimizedImage, ImgFallbackDirective],
  templateUrl: './product.component.html',
})
export class ProductComponent {
  readonly product = input.required<Product>();
  /** Carga la imagen con prioridad (para las tarjetas visibles al entrar). */
  readonly priority = input(false);
  readonly addToCart = output<Product>();

  readonly cover = computed(
    () => this.product().images[0] || IMAGE_PLACEHOLDER
  );

  addToCartHandler() {
    this.addToCart.emit(this.product());
  }
}
