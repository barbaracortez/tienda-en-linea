import { CartItem } from '@shared/models/cart-item.model';

export interface CustomerInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  /** Número de pedido legible, por ejemplo `NGS-4F7K2Q`. */
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
}
