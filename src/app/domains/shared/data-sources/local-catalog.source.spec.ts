import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CATEGORIES, PRODUCTS } from '@shared/data/catalog';
import { ProductQuery } from '@shared/models/product.model';
import { ProductNotFoundError } from './catalog-source';
import { CATALOG_LATENCY, LocalCatalogSource } from './local-catalog.source';

describe('LocalCatalogSource', () => {
  let source: LocalCatalogSource;
  const products = (query?: ProductQuery) =>
    firstValueFrom(source.getProducts(query));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CATALOG_LATENCY, useValue: () => 0 }],
    });
    source = TestBed.inject(LocalCatalogSource);
  });

  it('devuelve todo el catálogo sin filtros', async () => {
    expect((await products()).length).toBe(PRODUCTS.length);
  });

  it('devuelve las 5 categorías', async () => {
    expect(await firstValueFrom(source.getCategories())).toEqual(CATEGORIES);
  });

  it('filtra por categoría', async () => {
    const result = await products({ categorySlug: 'calzado' });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(p => p.category.slug === 'calzado')).toBeTrue();
  });

  it('busca por título sin distinguir mayúsculas ni acentos', async () => {
    const conAcento = await products({ title: 'LÁMPARA' });
    const sinAcento = await products({ title: 'lampara' });

    expect(conAcento.length).toBe(2);
    expect(sinAcento).toEqual(conAcento);
  });

  it('combina categoría y búsqueda', async () => {
    const result = await products({ categorySlug: 'ropa', title: 'campera' });

    expect(result.map(p => p.slug).sort()).toEqual([
      'campera-bomber-terracota',
      'campera-cuero-negra',
    ]);
  });

  it('filtra por rango de precio (inclusive)', async () => {
    const result = await products({ minPrice: 59, maxPrice: 95 });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(p => p.price >= 59 && p.price <= 95)).toBeTrue();
    expect(result.some(p => p.price === 59)).toBeTrue();
    expect(result.some(p => p.price === 95)).toBeTrue();
  });

  it('ordena por precio ascendente y descendente', async () => {
    const asc = (await products({ sort: 'price-asc' })).map(p => p.price);
    const desc = (await products({ sort: 'price-desc' })).map(p => p.price);

    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...asc].reverse());
  });

  it('ordena por más nuevos', async () => {
    const dates = (await products({ sort: 'newest' })).map(p =>
      Date.parse(p.creationAt)
    );

    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it('no modifica el orden del catálogo original al ordenar', async () => {
    const before = PRODUCTS.map(p => p.id);
    await products({ sort: 'price-desc' });

    expect(PRODUCTS.map(p => p.id)).toEqual(before);
  });

  it('devuelve una lista vacía si nada coincide', async () => {
    expect(await products({ title: 'no-existe-xyz' })).toEqual([]);
  });

  it('obtiene un producto por slug', async () => {
    const product = await firstValueFrom(
      source.getProductBySlug('reloj-analogico')
    );

    expect(product.title).toBe('Reloj analógico minimalista');
  });

  it('emite ProductNotFoundError si el slug no existe', async () => {
    await expectAsync(
      firstValueFrom(source.getProductBySlug('no-existe'))
    ).toBeRejectedWithError(ProductNotFoundError);
  });
});
