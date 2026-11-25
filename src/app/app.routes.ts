import { Routes } from '@angular/router';
import { cartNotEmptyGuard } from '@checkout/guards/cart-not-empty.guard';
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
        path: 'checkout',
        title: 'Finalizar compra',
        data: {
          description:
            'Checkout simulado de NgStore: datos de envío con validaciones, revisión del pedido y confirmación. No se cobra nada.',
        },
        canActivate: [cartNotEmptyGuard],
        loadComponent: () =>
          import('@checkout/pages/checkout/checkout.component'),
      },
      {
        path: 'checkout/confirmacion/:orderId',
        title: 'Pedido confirmado',
        data: { description: 'Confirmación de un pedido simulado en NgStore.' },
        loadComponent: () =>
          import('@checkout/pages/confirmation/confirmation.component'),
      },
      {
        path: 'about',
        title: 'Sobre el proyecto',
        data: {
          description:
            'Cómo está hecho NgStore: stack, decisiones técnicas (signals, lazy loading, data source intercambiable), accesibilidad y tests.',
        },
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
