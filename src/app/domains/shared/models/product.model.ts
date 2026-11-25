import { Category } from './category.model';

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  creationAt: string;
  category: Category;
}

export const PRODUCT_SORTS = ['newest', 'price-asc', 'price-desc'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

/** Criterios de búsqueda del catálogo. Todos son opcionales. */
export interface ProductQuery {
  categorySlug?: string;
  title?: string;
  sort?: ProductSort;
  minPrice?: number;
  maxPrice?: number;
}
