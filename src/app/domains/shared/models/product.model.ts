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

export interface ProductFilters {
  categorySlug?: string;
  title?: string;
}
