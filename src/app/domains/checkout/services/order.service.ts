import { Injectable } from '@angular/core';
import { Observable, defer, delay, of } from 'rxjs';
import { CustomerInfo, Order } from '@checkout/models/order.model';
import { CartItem } from '@shared/models/cart-item.model';

export const ORDERS_STORAGE_KEY = 'ng-store:orders';
const PROCESSING_MS = 900;

/**
 * Simula el alta de un pedido. No hay backend ni pagos: el pedido se guarda en
 * sessionStorage para poder mostrar la confirmación aunque se recargue la página.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  placeOrder(
    customer: CustomerInfo,
    items: readonly CartItem[],
    processingMs = PROCESSING_MS
  ): Observable<Order> {
    return defer(() => {
      if (items.length === 0) {
        throw new Error('No se puede crear un pedido sin productos');
      }
      const order: Order = {
        id: generateOrderId(),
        createdAt: new Date().toISOString(),
        customer: { ...customer },
        items: items.map(item => ({ ...item })),
        total: items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
      };
      this.save(order);
      return of(order);
    }).pipe(delay(processingMs));
  }

  getOrder(id: string): Order | null {
    return this.readAll()[id] ?? null;
  }

  private save(order: Order) {
    try {
      const orders = { ...this.readAll(), [order.id]: order };
      sessionStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Sin almacenamiento disponible: la confirmación solo vive en memoria.
    }
  }

  private readAll(): Record<string, Order> {
    try {
      const raw = sessionStorage.getItem(ORDERS_STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object'
        ? (parsed as Record<string, Order>)
        : {};
    } catch {
      return {};
    }
  }
}

/** `NGS-` seguido de 6 caracteres sin ambigüedades (sin 0/O ni 1/I). */
export function generateOrderId(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const values = crypto.getRandomValues(new Uint32Array(6));
  const code = Array.from(values, v => alphabet[v % alphabet.length]).join('');
  return `NGS-${code}`;
}
