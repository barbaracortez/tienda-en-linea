# NgStore · Tienda en línea con Angular

Aplicación de e-commerce construida con **Angular 19**, **signals** y **Tailwind CSS**. Consume la [Platzi Fake Store API](https://fakeapi.platzi.com/) y aplica las prácticas actuales del framework: componentes standalone, estado reactivo con signals, rutas con carga diferida y una arquitectura organizada por dominios.

![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

<!-- Agregá acá el enlace a la demo y una captura:
**Demo:** https://tu-demo.vercel.app
![Captura de NgStore](docs/screenshot.png)
-->

## Funcionalidades

- **Catálogo** con filtro por categoría y **búsqueda por nombre** (con debounce). El estado vive en la URL (`/category/shoes?q=sneaker`), así que se puede compartir, recargar y navegar con "atrás".
- **Detalle de producto** con galería de imágenes y selector de cantidad.
- **Carrito** en un panel lateral: cantidades, eliminar productos, total calculado y **persistencia en `localStorage`**.
- **Estados de carga, vacío y error** con skeletons y botón de reintentar.
- **Accesibilidad**: navegación por teclado, foco visible, etiquetas ARIA, `aria-live` para notificaciones y cierre del carrito con <kbd>Esc</kbd>.
- **Responsive** de móvil a escritorio, con títulos de página por ruta y precios con formato localizado (`es-AR`, USD).
- **Datos robustos**: se limpian URLs de imágenes mal formadas de la API y las imágenes rotas se reemplazan por un placeholder.

## Decisiones técnicas

| Tema             | Enfoque                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Estado           | `signal`, `computed` y `effect`. El carrito es un servicio con estado privado y API de solo lectura (`asReadonly`).       |
| Datos asíncronos | RxJS + `toSignal`/`toObservable`. Un operador propio, `toLoadState()`, modela `loading → success \| error`.               |
| Routing          | Rutas lazy (`loadComponent`), parámetros de ruta y query params enlazados como `input()` con `withComponentInputBinding`. |
| Arquitectura     | Carpetas por dominio (`products`, `info`, `shared`) y alias de importación (`@shared`, `@products`, `@info`, `@env`).     |
| Entornos         | `development`, `staging` y `production` con `fileReplacements`.                                                           |
| Calidad          | ESLint (angular-eslint, reglas de accesibilidad en templates), Prettier y tests unitarios con Jasmine/Karma.              |

## Estructura

```
src/app/
├── app.config.ts            # Providers: router, HttpClient, locale, títulos
├── app.routes.ts            # Rutas lazy
└── domains/
    ├── products/
    │   ├── components/product/        # Tarjeta de producto
    │   └── pages/{list,product-detail}/
    ├── info/pages/{about,not-found}/
    └── shared/
        ├── components/  # header, search, cart-drawer, toast, layout
        ├── directives/  # img-fallback
        ├── models/
        ├── services/    # product, category, cart, toast
        └── utils/       # load-state, normalize-images, title
```

## Cómo correrlo

Requisitos: Node.js 18.19+ y npm.

```bash
git clone https://github.com/barbaracortez/tienda-en-linea.git
cd tienda-en-linea
npm install
npm start
```

Abrí `http://localhost:4200/`.

## Scripts

| Comando                 | Descripción                         |
| ----------------------- | ----------------------------------- |
| `npm start`             | Servidor de desarrollo              |
| `npm run build`         | Build de producción en `dist/store` |
| `npm run build:staging` | Build con el entorno de staging     |
| `npm test`              | Tests unitarios (Karma + Jasmine)   |
| `npm run lint`          | ESLint sobre TypeScript y templates |
| `npm run format`        | Formatea el código con Prettier     |

## Próximos pasos

- Paginación o scroll infinito en el catálogo.
- Checkout con formulario y validaciones (hoy la compra es simulada).
- Tests de componentes y tests end-to-end.

---

Hecho por [Barbara Cortez](https://github.com/barbaracortez).
