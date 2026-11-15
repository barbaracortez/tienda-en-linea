import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { Product, ProductFilters } from '@shared/models/product.model';
import { MAIN_CATEGORY_SLUGS } from '@shared/services/category.service';
import { normalizeImages } from '@shared/utils/normalize-images';

/** Descarta productos de prueba que otros usuarios crean en la API pública. */
const isValidProduct = (product: Product): boolean =>
  product.title?.trim().length > 0 &&
  MAIN_CATEGORY_SLUGS.includes(product.category?.slug);

const normalizeProduct = (product: Product): Product => ({
  ...product,
  images: normalizeImages(product.images),
});

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/products`;

  getProducts(filters: ProductFilters = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (filters.categorySlug) {
      params = params.set('categorySlug', filters.categorySlug);
    }
    if (filters.title) {
      params = params.set('title', filters.title);
    }
    return this.http
      .get<Product[]>(this.baseUrl, { params })
      .pipe(
        map(products => products.filter(isValidProduct).map(normalizeProduct))
      );
  }

  getBySlug(slug: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.baseUrl}/slug/${encodeURIComponent(slug)}`)
      .pipe(map(normalizeProduct));
  }
}
