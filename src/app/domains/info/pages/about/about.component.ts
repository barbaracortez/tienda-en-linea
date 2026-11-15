import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
})
export default class AboutComponent {
  readonly features = [
    {
      title: 'Catálogo con filtros',
      text: 'Listado de productos por categoría y búsqueda por nombre, con el estado guardado en la URL.',
    },
    {
      title: 'Carrito persistente',
      text: 'Cantidades, eliminación y total calculado con signals; se guarda en localStorage.',
    },
    {
      title: 'Estados de carga y error',
      text: 'Skeletons mientras cargan los datos, mensajes claros y opción de reintentar.',
    },
    {
      title: 'Accesibilidad',
      text: 'Navegación por teclado, etiquetas ARIA, foco visible y panel del carrito que se cierra con Escape.',
    },
  ];

  readonly stack = [
    'Angular 19',
    'TypeScript',
    'Signals',
    'RxJS',
    'Standalone components',
    'Lazy loading',
    'Tailwind CSS',
    'ESLint + Prettier',
    'Jasmine + Karma',
  ];
}
