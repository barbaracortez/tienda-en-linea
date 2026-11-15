import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';
import { Product } from '@shared/models/product.model';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe, RouterLink, ImgFallbackDirective],
  templateUrl: './product.component.html',
})
export class ProductComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  addToCartHandler() {
    this.addToCart.emit(this.product());
  }
}
