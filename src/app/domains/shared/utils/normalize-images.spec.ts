import { normalizeImages } from './normalize-images';

describe('normalizeImages', () => {
  it('deja intactas las URLs válidas', () => {
    expect(normalizeImages(['https://i.imgur.com/a.jpeg'])).toEqual([
      'https://i.imgur.com/a.jpeg',
    ]);
  });

  it('limpia URLs envueltas en corchetes y comillas', () => {
    expect(
      normalizeImages([
        '["https://i.imgur.com/a.jpeg"',
        '"https://x.com/b.png"]',
      ])
    ).toEqual(['https://i.imgur.com/a.jpeg', 'https://x.com/b.png']);
  });

  it('descarta valores que no son URLs', () => {
    expect(normalizeImages(['', 'no-es-url', 'https://ok.com/c.jpg'])).toEqual([
      'https://ok.com/c.jpg',
    ]);
  });

  it('devuelve un array vacío si la entrada no es un array', () => {
    expect(normalizeImages(undefined)).toEqual([]);
    expect(normalizeImages('https://x.com/a.jpg')).toEqual([]);
  });
});
