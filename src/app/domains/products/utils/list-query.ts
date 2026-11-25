import {
  PRODUCT_SORTS,
  ProductQuery,
  ProductSort,
} from '@shared/models/product.model';

/** Query params crudos de la URL del listado. */
export interface ListQueryParams {
  slug?: string;
  q?: string;
  sort?: string;
  min?: string;
  max?: string;
}

export const SORT_OPTIONS: { value: ProductSort | ''; label: string }[] = [
  { value: '', label: 'Destacados' },
  { value: 'newest', label: 'Más nuevos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
];

/**
 * Convierte los parámetros de la URL en una consulta válida. Ignora valores
 * inválidos (para que una URL editada a mano no rompa la página) y ordena el
 * rango si viene invertido.
 */
export function parseListQuery(params: ListQueryParams): ProductQuery {
  let minPrice = parsePrice(params.min);
  let maxPrice = parsePrice(params.max);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  return {
    categorySlug: params.slug || undefined,
    title: params.q?.trim() || undefined,
    sort: isSort(params.sort) ? params.sort : undefined,
    minPrice,
    maxPrice,
  };
}

function parsePrice(value?: string): number | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

function isSort(value?: string): value is ProductSort {
  return PRODUCT_SORTS.includes(value as ProductSort);
}
