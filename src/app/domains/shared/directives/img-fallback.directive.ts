import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/** Imagen neutra servida desde `public/`, usada cuando falta o falla una foto. */
export const IMAGE_PLACEHOLDER = '/placeholder.svg';

/** Reemplaza imágenes rotas por un placeholder neutro. */
@Directive({
  selector: 'img[appImgFallback]',
})
export class ImgFallbackDirective {
  private readonly el = inject<ElementRef<HTMLImageElement>>(ElementRef);

  @HostListener('error')
  onError() {
    const img = this.el.nativeElement;
    if (!img.src.endsWith(IMAGE_PLACEHOLDER)) {
      img.removeAttribute('srcset');
      img.src = IMAGE_PLACEHOLDER;
    }
  }
}
