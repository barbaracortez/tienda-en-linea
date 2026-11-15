import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { environment } from '@env/environment';
import { Category } from '@shared/models/category.model';

/**
 * La API es pública y cualquiera puede crear categorías de prueba
 * ("testCategory…", etc.). Solo se muestran las categorías principales.
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

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  /** Las categorías casi no cambian: se piden una sola vez y se cachean. */
  private readonly categories$ = this.http
    .get<Category[]>(`${environment.apiUrl}/api/v1/categories`)
    .pipe(
      map(onlyMainCategories),
      shareReplay({ bufferSize: 1, refCount: false })
    );

  getAll() {
    return this.categories$;
  }
}
