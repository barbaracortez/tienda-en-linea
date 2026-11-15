import { TestBed } from '@angular/core/testing';
import { Product } from '@shared/models/product.model';
import { CART_STORAGE_KEY, CartService } from './cart.service';

const makeProduct = (id: number, price: number): Product => ({
  id,
  price,
  title: `Producto ${id}`,
  slug: `producto-${id}`,
  description: '',
  images: [],
  creationAt: '',
  category: { id: 1, name: 'Ropa', slug: 'ropa', image: '' },
});

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  afterEach(() => localStorage.removeItem(CART_STORAGE_KEY));

  it('empieza vacío', () => {
    expect(service.items()).toEqual([]);
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('agrupa el mismo producto sumando cantidades', () => {
    const product = makeProduct(1, 10);
    service.add(product);
    service.add(product, 2);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(3);
    expect(service.count()).toBe(3);
    expect(service.total()).toBe(30);
  });

  it('calcula el total con varios productos', () => {
    service.add(makeProduct(1, 10), 2);
    service.add(makeProduct(2, 5.5));

    expect(service.count()).toBe(3);
    expect(service.total()).toBe(25.5);
  });

  it('actualiza la cantidad y elimina al llegar a cero', () => {
    service.add(makeProduct(1, 10));
    service.updateQuantity(1, 4);
    expect(service.items()[0].quantity).toBe(4);

    service.updateQuantity(1, 0);
    expect(service.items()).toEqual([]);
  });

  it('quita un producto y vacía el carrito', () => {
    service.add(makeProduct(1, 10));
    service.add(makeProduct(2, 20));

    service.remove(1);
    expect(service.items().map(item => item.product.id)).toEqual([2]);

    service.clear();
    expect(service.count()).toBe(0);
  });

  it('persiste el carrito en localStorage', () => {
    service.add(makeProduct(1, 10), 2);
    TestBed.flushEffects();

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].quantity).toBe(2);
  });

  it('restaura el carrito guardado e ignora datos inválidos', () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([
        { product: makeProduct(1, 10), quantity: 2 },
        { product: null, quantity: 1 },
        { product: makeProduct(2, 5), quantity: -1 },
      ])
    );
    TestBed.resetTestingModule();
    const restored = TestBed.inject(CartService);

    expect(restored.items().length).toBe(1);
    expect(restored.total()).toBe(20);
  });

  it('no falla si localStorage tiene JSON corrupto', () => {
    localStorage.setItem(CART_STORAGE_KEY, '{no es json');
    TestBed.resetTestingModule();

    expect(TestBed.inject(CartService).items()).toEqual([]);
  });
});
