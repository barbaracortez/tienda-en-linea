import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { Category } from '@shared/models/category.model';
import { Product, ProductQuery } from '@shared/models/product.model';
import { normalizeImages } from '@shared/utils/normalize-images';
import { queryProducts } from '@shared/utils/query-products';
import { CatalogSource } from './catalog-source';

/**
 * La API es pública y cualquiera puede crear categorías y productos de prueba.
 * Solo se muestran las categorías principales.
 */
export const MAIN_CATEGORY_SLUGS = [
  'clothes',
  'electronics',
  'furniture',
  'shoes',
  'miscellaneous',
];

export function onlyMainCategories(categories: Category[]): Category[] {
  const main = categories.filter(c => MAIN_CATEGORY_SLUGS.includes(c.slug));
  // Si la API cambiara sus slugs, mejor mostrar todo que no mostrar nada.
  return main.length > 0 ? main : categories;
}

const isValidProduct = (product: Product): boolean =>
  product.title?.trim().length > 0 &&
  MAIN_CATEGORY_SLUGS.includes(product.category?.slug);

const normalizeProduct = (product: Product): Product => ({
  ...product,
  images: normalizeImages(product.images),
});

/** Catálogo desde la Platzi Fake Store API (https://fakeapi.platzi.com). */
@Injectable({ providedIn: 'root' })
export class PlatziApiSource implements CatalogSource {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1`;

  getProducts(query: ProductQuery = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (query.categorySlug) {
      params = params.set('categorySlug', query.categorySlug);
    }
    // Búsqueda, precio y orden se aplican en el cliente para que se comporten
    // igual que con el catálogo local (sin distinguir mayúsculas ni acentos).
    return this.http
      .get<Product[]>(`${this.baseUrl}/products`, { params })
      .pipe(
        map(products =>
          queryProducts(
            products.filter(isValidProduct).map(normalizeProduct),
            query
          )
        )
      );
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.baseUrl}/products/slug/${encodeURIComponent(slug)}`)
      .pipe(map(normalizeProduct));
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.baseUrl}/categories`)
      .pipe(map(onlyMainCategories));
  }
}
