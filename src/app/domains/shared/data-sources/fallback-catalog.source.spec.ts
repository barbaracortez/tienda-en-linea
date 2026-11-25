import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { environment } from '@env/environment';
import { PRODUCTS } from '@shared/data/catalog';
import { Product } from '@shared/models/product.model';
import {
  API_TIMEOUT_MS,
  FallbackCatalogSource,
} from './fallback-catalog.source';
import { CATALOG_LATENCY } from './local-catalog.source';

describe('FallbackCatalogSource', () => {
  const productsUrl = `${environment.apiUrl}/api/v1/products`;
  let source: FallbackCatalogSource;
  let http: HttpTestingController;

  const apiProduct = {
    id: 99,
    title: 'Remera de la API',
    slug: 'remera-api',
    price: 10,
    images: ['https://example.com/a.jpg'],
    creationAt: '2026-01-01T00:00:00.000Z',
    description: '',
    category: { id: 1, name: 'Clothes', slug: 'clothes', image: '' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CATALOG_LATENCY, useValue: () => 0 },
      ],
    });
    source = TestBed.inject(FallbackCatalogSource);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('usa la API cuando responde bien', () => {
    let result: Product[] = [];
    source.getProducts().subscribe(products => (result = products));

    http.expectOne(productsUrl).flush([apiProduct]);

    expect(result.map(p => p.id)).toEqual([99]);
    expect(source.usingLocal()).toBeFalse();
  });

  it('pasa al catálogo local si la API devuelve un error de servidor', () => {
    let result: Product[] = [];
    source.getProducts().subscribe(products => (result = products));

    http
      .expectOne(productsUrl)
      .flush('Service Unavailable', { status: 503, statusText: 'Unavailable' });

    expect(result.length).toBe(PRODUCTS.length);
    expect(source.usingLocal()).toBeTrue();
  });

  it('pasa al catálogo local si hay un error de red', () => {
    let result: Product[] = [];
    source.getProducts().subscribe(products => (result = products));

    http.expectOne(productsUrl).error(new ProgressEvent('error'));

    expect(result.length).toBe(PRODUCTS.length);
  });

  it(`pasa al catálogo local si la API tarda más de ${API_TIMEOUT_MS} ms`, fakeAsync(() => {
    let result: Product[] = [];
    source.getProducts().subscribe(products => (result = products));
    const req = http.expectOne(productsUrl);

    tick(API_TIMEOUT_MS - 1);
    expect(result).toEqual([]);

    tick(1);
    expect(req.cancelled).toBeTrue();
    expect(result.length).toBe(PRODUCTS.length);
    expect(source.usingLocal()).toBeTrue();
  }));

  it('después del fallback no vuelve a llamar a la API', () => {
    source.getProducts().subscribe();
    http
      .expectOne(productsUrl)
      .flush('error', { status: 500, statusText: 'Server Error' });

    let title = '';
    source
      .getProductBySlug('reloj-analogico')
      .subscribe(product => (title = product.title));

    http.expectNone(() => true);
    expect(title).toBe('Reloj analógico minimalista');
  });

  it('no cambia de fuente ante un 4xx (el recurso no existe)', () => {
    let failed = false;
    source
      .getProductBySlug('no-existe')
      .subscribe({ error: () => (failed = true) });

    http
      .expectOne(`${productsUrl}/slug/no-existe`)
      .flush('Not found', { status: 400, statusText: 'Bad Request' });

    expect(failed).toBeTrue();
    expect(source.usingLocal()).toBeFalse();
  });
});
