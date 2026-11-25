import { Observable } from 'rxjs';
import { Category } from '@shared/models/category.model';
import { Product, ProductQuery } from '@shared/models/product.model';

/**
 * Contrato común para obtener el catálogo. Los componentes dependen de esta
 * interfaz (vía `CATALOG_SOURCE`) y no saben de dónde salen los datos.
 */
export interface CatalogSource {
  getProducts(query?: ProductQuery): Observable<Product[]>;
  getProductBySlug(slug: string): Observable<Product>;
  getCategories(): Observable<Category[]>;
}

export class ProductNotFoundError extends Error {
  constructor(slug: string) {
    super(`No existe un producto con el slug "${slug}"`);
    this.name = 'ProductNotFoundError';
  }
}
