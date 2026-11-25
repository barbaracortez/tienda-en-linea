import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';

export const APP_NAME = 'NgStore';

export const DEFAULT_DESCRIPTION =
  'Tienda en línea de demostración hecha con Angular 19, signals y Tailwind CSS: catálogo con filtros, carrito persistente y checkout simulado.';

export function pageTitle(title?: string): string {
  return title ? `${title} · ${APP_NAME}` : APP_NAME;
}

/** Recorta un texto a `max` caracteres sin cortar palabras. */
export function truncate(text: string, max = 155): string {
  if (text.length <= max) {
    return text;
  }
  return text.slice(0, text.lastIndexOf(' ', max - 1)) + '…';
}

/** Título y meta description de cada página (también para Open Graph). */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(page: { title?: string; description?: string }) {
    const title = pageTitle(page.title);
    const description = page.description ?? DEFAULT_DESCRIPTION;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
  }
}

/**
 * Toma `title` y `data.description` de la ruta activa. Las páginas con datos
 * dinámicos (como el detalle de producto) llaman a `SeoService` al cargar.
 */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot) {
    this.seo.update({
      title: this.buildTitle(snapshot),
      description: deepestRoute(snapshot.root).data['description'],
    });
  }
}

function deepestRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  return route.firstChild ? deepestRoute(route.firstChild) : route;
}
