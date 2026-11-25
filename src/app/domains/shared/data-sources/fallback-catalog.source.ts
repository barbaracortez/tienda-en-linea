import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, defer, throwError, timeout } from 'rxjs';
import { Category } from '@shared/models/category.model';
import { Product, ProductQuery } from '@shared/models/product.model';
import { CatalogSource } from './catalog-source';
import { LocalCatalogSource } from './local-catalog.source';
import { PlatziApiSource } from './platzi-api.source';

export const API_TIMEOUT_MS = 6000;

/**
 * Usa la API y, si falla o tarda más de `API_TIMEOUT_MS`, pasa al catálogo
 * local por el resto de la sesión. Cambiar de fuente a mitad de camino
 * mezclaría categorías y slugs de catálogos distintos.
 */
@Injectable({ providedIn: 'root' })
export class FallbackCatalogSource implements CatalogSource {
  private readonly api = inject(PlatziApiSource);
  private readonly local = inject(LocalCatalogSource);
  private readonly _usingLocal = signal(false);

  /** `true` una vez que la API falló y se pasó al catálogo local. */
  readonly usingLocal = this._usingLocal.asReadonly();

  getProducts(query?: ProductQuery): Observable<Product[]> {
    return this.withFallback(source => source.getProducts(query));
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.withFallback(source => source.getProductBySlug(slug));
  }

  getCategories(): Observable<Category[]> {
    return this.withFallback(source => source.getCategories());
  }

  private withFallback<T>(
    call: (source: CatalogSource) => Observable<T>
  ): Observable<T> {
    return defer(() => {
      if (this._usingLocal()) {
        return call(this.local);
      }
      return call(this.api).pipe(
        timeout(API_TIMEOUT_MS),
        catchError((error: unknown) => {
          if (isClientError(error)) {
            // 4xx: la API funciona, el recurso no existe. No hay que cambiar de fuente.
            return throwError(() => error);
          }
          this._usingLocal.set(true);
          return call(this.local);
        })
      );
    });
  }
}

function isClientError(error: unknown): boolean {
  return (
    error instanceof HttpErrorResponse &&
    error.status >= 400 &&
    error.status < 500
  );
}
