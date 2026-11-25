import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '@checkout/services/order.service';

@Component({
  selector: 'app-confirmation',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './confirmation.component.html',
})
export default class ConfirmationComponent {
  private readonly orders = inject(OrderService);

  /** Parámetro de ruta `/checkout/confirmacion/:orderId`. */
  readonly orderId = input.required<string>();

  readonly order = computed(() => this.orders.getOrder(this.orderId()));
  readonly itemCount = computed(
    () => this.order()?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  );
}
