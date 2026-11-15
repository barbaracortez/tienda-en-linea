import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { Product } from '@shared/models/product.model';
import { ProductService } from './product.service';

describe('ProductService', () => {
  const baseUrl = `${environment.apiUrl}/api/v1/products`;
  let service: ProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('pide todos los productos sin filtros', () => {
    service.getProducts().subscribe();

    const req = http.expectOne(baseUrl);
    expect(req.request.params.keys()).toEqual([]);
    req.flush([]);
  });

  it('envía categoría y búsqueda como query params', () => {
    service.getProducts({ categorySlug: 'shoes', title: 'run' }).subscribe();

    const req = http.expectOne(r => r.url === baseUrl);
    expect(req.request.params.get('categorySlug')).toBe('shoes');
    expect(req.request.params.get('title')).toBe('run');
    req.flush([]);
  });

  it('descarta productos de prueba fuera de las categorías principales', () => {
    let result: Product[] = [];
    service.getProducts().subscribe(products => (result = products));

    http.expectOne(baseUrl).flush([
      { id: 1, title: 'Remera', images: [], category: { slug: 'clothes' } },
      { id: 2, title: 'Mesa', images: [], category: { slug: 'furniture-x1' } },
      { id: 3, title: '  ', images: [], category: { slug: 'shoes' } },
    ]);

    expect(result.map(p => p.id)).toEqual([1]);
  });

  it('normaliza las imágenes del producto', () => {
    let result: Product | undefined;
    service.getBySlug('remera azul').subscribe(p => (result = p));

    http
      .expectOne(`${baseUrl}/slug/remera%20azul`)
      .flush({ id: 1, images: ['["https://i.imgur.com/a.jpeg"]'] });

    expect(result?.images).toEqual(['https://i.imgur.com/a.jpeg']);
  });
});
