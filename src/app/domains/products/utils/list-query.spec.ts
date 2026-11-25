import { parseListQuery } from './list-query';

describe('parseListQuery', () => {
  it('convierte los parámetros válidos', () => {
    expect(
      parseListQuery({
        slug: 'ropa',
        q: '  campera ',
        sort: 'price-asc',
        min: '10',
        max: '99.5',
      })
    ).toEqual({
      categorySlug: 'ropa',
      title: 'campera',
      sort: 'price-asc',
      minPrice: 10,
      maxPrice: 99.5,
    });
  });

  it('ignora valores inválidos', () => {
    expect(
      parseListQuery({ q: '   ', sort: 'cualquiera', min: 'abc', max: '-5' })
    ).toEqual({
      categorySlug: undefined,
      title: undefined,
      sort: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  });

  it('acepta un precio mínimo de 0', () => {
    expect(parseListQuery({ min: '0' }).minPrice).toBe(0);
  });

  it('ordena el rango si viene invertido', () => {
    const query = parseListQuery({ min: '200', max: '50' });

    expect(query.minPrice).toBe(50);
    expect(query.maxPrice).toBe(200);
  });
});
