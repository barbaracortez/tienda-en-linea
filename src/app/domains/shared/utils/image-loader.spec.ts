import { productImageLoader } from './image-loader';

describe('productImageLoader', () => {
  const src = '/products/reloj-analogico-1.webp';

  it('usa la variante de 400 px cuando alcanza', () => {
    expect(productImageLoader({ src, width: 400 })).toBe(
      '/products/400/reloj-analogico-1.webp'
    );
    expect(productImageLoader({ src, width: 112 })).toBe(
      '/products/400/reloj-analogico-1.webp'
    );
  });

  it('usa la original de 800 px para anchos mayores o sin ancho', () => {
    expect(productImageLoader({ src, width: 800 })).toBe(src);
    expect(productImageLoader({ src })).toBe(src);
  });

  it('no toca imágenes remotas ni el placeholder', () => {
    const remote = 'https://i.imgur.com/a.jpeg';
    expect(productImageLoader({ src: remote, width: 200 })).toBe(remote);
    expect(productImageLoader({ src: '/placeholder.svg', width: 200 })).toBe(
      '/placeholder.svg'
    );
  });
});
