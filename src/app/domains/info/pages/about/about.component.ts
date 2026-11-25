import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Item {
  title: string;
  text: string;
}

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
})
export default class AboutComponent {
  readonly repoUrl = 'https://github.com/barbaracortez/tienda-en-linea';
  readonly portfolioUrl = 'https://barbaracortez.vercel.app';

  readonly features: Item[] = [
    {
      title: 'Catálogo con filtros',
      text: 'Categorías, búsqueda sin distinguir mayúsculas ni acentos, rango de precio y ordenamiento.',
    },
    {
      title: 'Carrito persistente',
      text: 'Cantidades, eliminación y total calculado con signals. Se guarda en localStorage.',
    },
    {
      title: 'Checkout simulado',
      text: 'Datos de envío con validaciones, revisión del pedido y confirmación con número de pedido.',
    },
    {
      title: 'Estados de carga, vacío y error',
      text: 'Skeletons con latencia simulada, mensajes claros y opción de reintentar o limpiar filtros.',
    },
  ];

  readonly decisions: Item[] = [
    {
      title: 'Estado con signals',
      text: 'signal, computed y effect para el estado local y del carrito; RxJS solo donde aporta (peticiones, debounce, cancelación con switchMap).',
    },
    {
      title: 'Data source intercambiable',
      text: 'Los componentes dependen de la interfaz CatalogSource a través de un InjectionToken. Un catálogo local (por defecto) y la API de Platzi, con fallback automático si falla o tarda más de 6 s.',
    },
    {
      title: 'Estado en la URL',
      text: 'Categoría, búsqueda, orden y precio viven en la URL y llegan a los componentes como input() gracias a withComponentInputBinding: se pueden compartir, recargar y navegar con "atrás".',
    },
    {
      title: 'Lazy loading y arquitectura por dominios',
      text: 'Cada página se carga bajo demanda. El código se organiza en products, checkout, info y shared, con alias de importación.',
    },
    {
      title: 'Accesibilidad',
      text: 'Navegación completa con teclado, foco visible y gestionado (diálogo del carrito, pasos del checkout), labels y mensajes de error asociados, y contraste AA.',
    },
    {
      title: 'Tests y calidad',
      text: 'Tests unitarios con Jasmine para el catálogo, el fallback, el carrito y las validaciones. ESLint (con reglas de accesibilidad) y Prettier.',
    },
  ];

  readonly stack = [
    'Angular 19',
    'TypeScript',
    'Signals',
    'RxJS',
    'Reactive Forms',
    'Tailwind CSS',
    'NgOptimizedImage',
    'Jasmine + Karma',
    'ESLint + Prettier',
  ];
}
