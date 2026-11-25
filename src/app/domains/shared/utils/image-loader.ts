import { ImageLoaderConfig } from '@angular/common';

/** Ancho de la variante chica de las fotos locales (`public/products/400/`). */
export const SMALL_IMAGE_WIDTH = 400;

/**
 * Loader de NgOptimizedImage: si el navegador necesita 400 px o menos, sirve
 * la variante chica de las fotos del catálogo local. Las imágenes remotas
 * (modo API) se devuelven sin cambios.
 */
export function productImageLoader({ src, width }: ImageLoaderConfig): string {
  if (
    src.startsWith('/products/') &&
    width !== undefined &&
    width <= SMALL_IMAGE_WIDTH
  ) {
    return src.replace('/products/', `/products/${SMALL_IMAGE_WIDTH}/`);
  }
  return src;
}
