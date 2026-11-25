import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, defer, delay, of } from 'rxjs';
import { CATEGORIES, PRODUCTS } from '@shared/data/catalog';
import { Category } from '@shared/models/category.model';
import { Product, ProductQuery } from '@shared/models/product.model';
import { queryProducts } from '@shared/utils/query-products';
import { CatalogSource, ProductNotFoundError } from './catalog-source';

/**
 * Devuelve la latencia simulada en ms. Por defecto entre 300 y 600 ms para que
 * los estados de carga se vean como con una API real. En tests se usa 0.
 *
 * No se aplica a la carga inicial de la página (para no penalizar el primer
 * renderizado), sino a las interacciones: filtros, búsqueda y navegación.
 */
export const CATALOG_LATENCY = new InjectionToken<() => number>(
  'CATALOG_LATENCY',
  { providedIn: 'root', factory: () => () => 300 + Math.random() * 300 }
);

/** Catálogo embebido en la app: funciona siempre, sin depender de la red. */
@Injectable({ providedIn: 'root' })
export class LocalCatalogSource implements CatalogSource {
  private readonly latency = inject(CATALOG_LATENCY);
  private initialLoad = true;

  getProducts(query: ProductQuery = {}): Observable<Product[]> {
    return this.respond(() => queryProducts(PRODUCTS, query), true);
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.respond(() => {
      const product = PRODUCTS.find(p => p.slug === slug);
      if (!product) {
        throw new ProductNotFoundError(slug);
      }
      return product;
    }, true);
  }

  getCategories(): Observable<Category[]> {
    return this.respond(() => CATEGORIES);
  }

  /**
   * @param endsInitialLoad la primera consulta de productos marca el fin de la
   *   carga inicial: desde ahí, cada respuesta tiene latencia simulada.
   */
  private respond<T>(compute: () => T, endsInitialLoad = false): Observable<T> {
    return defer(() => {
      const ms = this.initialLoad ? 0 : this.latency();
      if (endsInitialLoad) {
        this.initialLoad = false;
      }
      const result = of(compute());
      return ms > 0 ? result.pipe(delay(ms)) : result;
    });
  }
}
