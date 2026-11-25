import {
  IMAGE_CONFIG,
  IMAGE_LOADER,
  registerLocaleData,
} from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localeEsAr from '@angular/common/locales/es-AR';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import {
  SMALL_IMAGE_WIDTH,
  productImageLoader,
} from '@shared/utils/image-loader';
import { AppTitleStrategy } from '@shared/utils/title';

import { routes } from './app.routes';

registerLocaleData(localeEsAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideHttpClient(withFetch()),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: LOCALE_ID, useValue: 'es-AR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'USD' },
    // Imágenes responsive: variantes de 400 y 800 px de las fotos locales.
    { provide: IMAGE_LOADER, useValue: productImageLoader },
    {
      provide: IMAGE_CONFIG,
      useValue: { breakpoints: [SMALL_IMAGE_WIDTH, 800] },
    },
  ],
};
