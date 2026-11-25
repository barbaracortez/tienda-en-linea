import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { Category } from '@shared/models/category.model';
import { Product } from '@shared/models/product.model';
import { PlatziApiSource } from './platzi-api.source';

describe('PlatziApiSource', () => {
  const baseUrl = `${environment.apiUrl}/api/v1`;
  let source: PlatziApiSource;
  let http: HttpTestingController;

  const product = (id: number, title: string, slug: string, price = 10) => ({
    id,
    title,
    price,
    images: [],
    creationAt: '2026-01-01T00:00:00.000Z',
    category: { slug },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    source = TestBed.inject(PlatziApiSource);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envía la categoría como query param', () => {
    source.getProducts({ categorySlug: 'shoes' }).subscribe();

    const req = http.expectOne(r => r.url === `${baseUrl}/products`);
    expect(req.request.params.get('categorySlug')).toBe('shoes');
    req.flush([]);
  });

  it('descarta productos de prueba y aplica búsqueda y orden en el cliente', () => {
    let result: Product[] = [];
    source
      .getProducts({ title: 'remera', sort: 'price-desc' })
      .subscribe(products => (result = products));

    http
      .expectOne(`${baseUrl}/products`)
      .flush([
        product(1, 'Remera azul', 'clothes', 10),
        product(2, 'Remera roja', 'clothes', 30),
        product(3, 'Remera de prueba', 'clothes-test-123', 50),
        product(4, '  ', 'clothes'),
        product(5, 'Gorra', 'clothes'),
      ]);

    expect(result.map(p => p.id)).toEqual([2, 1]);
  });

  it('normaliza las imágenes del producto', () => {
    let result: Product | undefined;
    source.getProductBySlug('remera azul').subscribe(p => (result = p));

    http
      .expectOne(`${baseUrl}/products/slug/remera%20azul`)
      .flush({ id: 1, images: ['["https://i.imgur.com/a.jpeg"]'] });

    expect(result?.images).toEqual(['https://i.imgur.com/a.jpeg']);
  });

  it('muestra solo las categorías principales', () => {
    let result: Category[] = [];
    source.getCategories().subscribe(categories => (result = categories));

    http.expectOne(`${baseUrl}/categories`).flush([
      { id: 1, name: 'Clothes', slug: 'clothes', image: '' },
      { id: 9, name: 'testCategory', slug: 'testcategory-abc', image: '' },
    ]);

    expect(result.map(c => c.slug)).toEqual(['clothes']);
  });
});
