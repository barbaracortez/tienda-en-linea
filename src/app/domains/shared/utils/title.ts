import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const APP_NAME = 'NgStore';

export function pageTitle(title?: string): string {
  return title ? `${title} · ${APP_NAME}` : APP_NAME;
}

/** Agrega el nombre de la tienda a los títulos definidos en las rutas. */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot) {
    this.title.setTitle(pageTitle(this.buildTitle(snapshot)));
  }
}
