import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem } from '@shared/models/cart-item.model';
import { Product } from '@shared/models/product.model';

export const CART_STORAGE_KEY = 'ng-store:cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>(loadCart());

  readonly items = this._items.asReadonly();
  readonly count = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly total = computed(() =>
    this._items().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  /** Estado del panel lateral del carrito. */
  readonly isOpen = signal(false);

  constructor() {
    effect(() => saveCart(this._items()));
  }

  add(product: Product, quantity = 1) {
    this._items.update(items => {
      const exists = items.some(item => item.product.id === product.id);
      if (!exists) {
        return [...items, { product, quantity }];
      }
      return items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    });
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this._items.update(items =>
      items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  remove(productId: number) {
    this._items.update(items =>
      items.filter(item => item.product.id !== productId)
    );
  }

  clear() {
    this._items.set([]);
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}

function isCartItem(value: unknown): value is CartItem {
  const item = value as CartItem | null;
  return (
    typeof item?.product?.id === 'number' &&
    typeof item.product.price === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena): se ignora.
  }
}
