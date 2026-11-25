import { InjectionToken, inject } from '@angular/core';
import { environment } from '@env/environment';
import { CatalogSource } from './catalog-source';
import { FallbackCatalogSource } from './fallback-catalog.source';
import { LocalCatalogSource } from './local-catalog.source';

/**
 * Fuente del catálogo que usa toda la app. Se elige con
 * `environment.dataSource`: `'local'` (por defecto) o `'api'` (con fallback).
 */
export const CATALOG_SOURCE = new InjectionToken<CatalogSource>(
  'CATALOG_SOURCE',
  {
    providedIn: 'root',
    factory: () =>
      environment.dataSource === 'api'
        ? inject(FallbackCatalogSource)
        : inject(LocalCatalogSource),
  }
);
