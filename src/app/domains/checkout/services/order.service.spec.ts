import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { PRODUCTS } from '@shared/data/catalog';
import { CustomerInfo } from '@checkout/models/order.model';
import {
  ORDERS_STORAGE_KEY,
  OrderService,
  generateOrderId,
} from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  const customer: CustomerInfo = {
    fullName: 'Ana Pérez',
    email: 'ana@ejemplo.com',
    address: 'Av. Corrientes 1234',
    city: 'Buenos Aires',
    postalCode: '1425',
  };
  const items = [
    { product: PRODUCTS[0], quantity: 2 },
    { product: PRODUCTS[1], quantity: 1 },
  ];

  beforeEach(() => {
    sessionStorage.removeItem(ORDERS_STORAGE_KEY);
    service = TestBed.inject(OrderService);
  });

  afterEach(() => sessionStorage.removeItem(ORDERS_STORAGE_KEY));

  it('crea un pedido con número, total y copia de los datos', async () => {
    const order = await firstValueFrom(service.placeOrder(customer, items, 0));

    expect(order.id).toMatch(/^NGS-[A-Z2-9]{6}$/);
    expect(order.total).toBe(PRODUCTS[0].price * 2 + PRODUCTS[1].price);
    expect(order.items.length).toBe(2);
    expect(order.customer).toEqual(customer);
    expect(order.customer).not.toBe(customer);
  });

  it('permite recuperar el pedido por su número', async () => {
    const order = await firstValueFrom(service.placeOrder(customer, items, 0));

    expect(service.getOrder(order.id)).toEqual(order);
    expect(service.getOrder('NGS-NOEXISTE')).toBeNull();
  });

  it('no crea pedidos sin productos', async () => {
    await expectAsync(
      firstValueFrom(service.placeOrder(customer, [], 0))
    ).toBeRejectedWithError(/sin productos/);
  });

  it('genera números de pedido distintos', () => {
    const ids = new Set(Array.from({ length: 50 }, generateOrderId));
    expect(ids.size).toBe(50);
  });
});
