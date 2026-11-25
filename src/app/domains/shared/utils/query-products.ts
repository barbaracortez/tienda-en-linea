import {
  Product,
  ProductQuery,
  ProductSort,
} from '@shared/models/product.model';

/** Minúsculas y sin acentos: "Lámpara" y "lampara" se consideran iguales. */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Filtra y ordena productos según la consulta. No modifica el array original. */
export function queryProducts(
  products: readonly Product[],
  query: ProductQuery = {}
): Product[] {
  const term = normalizeText(query.title ?? '');
  const { categorySlug, minPrice, maxPrice } = query;

  const filtered = products.filter(
    product =>
      (!categorySlug || product.category.slug === categorySlug) &&
      (!term || normalizeText(product.title).includes(term)) &&
      (minPrice === undefined || product.price >= minPrice) &&
      (maxPrice === undefined || product.price <= maxPrice)
  );

  return sortProducts(filtered, query.sort);
}

function sortProducts(products: Product[], sort?: ProductSort): Product[] {
  switch (sort) {
    case 'price-asc':
      return products.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return products.sort((a, b) => b.price - a.price);
    case 'newest':
      return products.sort(
        (a, b) => Date.parse(b.creationAt) - Date.parse(a.creationAt)
      );
    default:
      return products;
  }
}
