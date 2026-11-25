import { CATEGORIES, PRODUCTS } from './catalog';

/** Verifica la integridad del catálogo para que un error de tipeo no rompa la demo. */
describe('Catálogo local', () => {
  it('tiene 5 categorías y 24 productos', () => {
    expect(CATEGORIES.length).toBe(5);
    expect(PRODUCTS.length).toBe(24);
  });

  it('usa ids y slugs únicos', () => {
    expect(new Set(PRODUCTS.map(p => p.id)).size).toBe(PRODUCTS.length);
    expect(new Set(PRODUCTS.map(p => p.slug)).size).toBe(PRODUCTS.length);
  });

  it('asigna cada producto a una categoría existente', () => {
    for (const product of PRODUCTS) {
      expect(CATEGORIES).toContain(product.category);
    }
  });

  it('tiene entre 2 y 3 imágenes locales en WebP por producto', () => {
    for (const product of PRODUCTS) {
      expect(product.images.length).toBeGreaterThanOrEqual(2);
      expect(product.images.length).toBeLessThanOrEqual(3);
      for (const image of product.images) {
        expect(image).toMatch(/^\/products\/[a-z0-9-]+-\d\.webp$/);
      }
    }
  });

  it('tiene precios positivos y fechas válidas', () => {
    for (const product of PRODUCTS) {
      expect(product.price).toBeGreaterThan(0);
      expect(Number.isNaN(Date.parse(product.creationAt))).toBeFalse();
    }
  });
});
