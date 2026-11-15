import { Directive, ElementRef, HostListener, inject } from '@angular/core';

export const IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#1A2035"/><path d="M140 250l45-55 35 40 25-30 55 45z" fill="#2A3048"/><circle cx="250" cy="160" r="22" fill="#2A3048"/></svg>'
  );

/** Reemplaza imágenes rotas por un placeholder neutro. */
@Directive({
  selector: 'img[appImgFallback]',
})
export class ImgFallbackDirective {
  private readonly el = inject<ElementRef<HTMLImageElement>>(ElementRef);

  @HostListener('error')
  onError() {
    const img = this.el.nativeElement;
    if (img.src !== IMAGE_PLACEHOLDER) {
      img.src = IMAGE_PLACEHOLDER;
    }
  }
}
