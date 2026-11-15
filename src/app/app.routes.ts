import { Routes } from '@angular/router';
import { LayoutComponent } from '@shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        title: 'Productos',
        loadComponent: () => import('@products/pages/list/list.component'),
      },
      {
        path: 'category/:slug',
        title: 'Productos',
        loadComponent: () => import('@products/pages/list/list.component'),
      },
      {
        path: 'product/:slug',
        loadComponent: () =>
          import('@products/pages/product-detail/product-detail.component'),
      },
      {
        path: 'about',
        title: 'Sobre el proyecto',
        loadComponent: () => import('@info/pages/about/about.component'),
      },
      {
        path: '**',
        title: 'Página no encontrada',
        loadComponent: () =>
          import('@info/pages/not-found/not-found.component'),
      },
    ],
  },
];
