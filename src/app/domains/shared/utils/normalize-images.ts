/**
 * La API de Platzi a veces devuelve URLs envueltas en corchetes y comillas
 * (por ejemplo `["https://..."]`). Esta función las limpia y descarta las
 * que no son URLs válidas.
 */
export function normalizeImages(images: unknown): string[] {
  if (!Array.isArray(images)) {
    return [];
  }
  return images
    .map(image =>
      String(image)
        .replace(/^\[?"?|"?\]?$/g, '')
        .trim()
    )
    .filter(url => /^https?:\/\//.test(url));
}
