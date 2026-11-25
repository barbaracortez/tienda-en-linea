import { Category } from '@shared/models/category.model';
import { Product } from '@shared/models/product.model';

/**
 * Catálogo de ejemplo con el que funciona la demo.
 * Las fotos son de Unsplash y están en `public/products/` (WebP, 800x800).
 */

const images = (slug: string, count: 2 | 3): string[] =>
  Array.from({ length: count }, (_, i) => `/products/${slug}-${i + 1}.webp`);

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Ropa',
    slug: 'ropa',
    image: '/products/campera-bomber-terracota-1.webp',
  },
  {
    id: 2,
    name: 'Electrónica',
    slug: 'electronica',
    image: '/products/auriculares-inalambricos-1.webp',
  },
  {
    id: 3,
    name: 'Hogar',
    slug: 'hogar',
    image: '/products/sofa-terciopelo-verde-1.webp',
  },
  {
    id: 4,
    name: 'Calzado',
    slug: 'calzado',
    image: '/products/borcegos-cuero-1.webp',
  },
  {
    id: 5,
    name: 'Accesorios',
    slug: 'accesorios',
    image: '/products/reloj-analogico-1.webp',
  },
];

const [ropa, electronica, hogar, calzado, accesorios] = CATEGORIES;

export const PRODUCTS: Product[] = [
  // Ropa
  {
    id: 1,
    title: 'Buzo con capucha gris melange',
    slug: 'buzo-capucha-gris',
    description:
      'Buzo de algodón frizado con capucha forrada, bolsillo canguro y puños elastizados. Abriga sin pesar y mantiene la forma lavado tras lavado.',
    price: 48,
    images: images('buzo-capucha-gris', 3),
    creationAt: '2026-03-12T10:00:00.000Z',
    category: ropa,
  },
  {
    id: 2,
    title: 'Remera básica de algodón blanca',
    slug: 'remera-basica-blanca',
    description:
      'Remera de jersey 100 % algodón peinado, cuello redondo y calce regular. La base de cualquier conjunto, suave desde el primer uso.',
    price: 18,
    images: images('remera-basica-blanca', 2),
    creationAt: '2026-01-20T10:00:00.000Z',
    category: ropa,
  },
  {
    id: 3,
    title: 'Campera de cuero negra',
    slug: 'campera-cuero-negra',
    description:
      'Campera estilo motociclista de cuero vacuno con cierres metálicos, solapas asimétricas y forro interior de satén. Un clásico que mejora con el tiempo.',
    price: 189,
    images: images('campera-cuero-negra', 3),
    creationAt: '2026-09-02T10:00:00.000Z',
    category: ropa,
  },
  {
    id: 4,
    title: 'Campera bomber terracota',
    slug: 'campera-bomber-terracota',
    description:
      'Bomber liviana de nylon repelente al agua, con cierre frontal, bolsillos laterales y terminaciones en rib. Ideal para entretiempo.',
    price: 79,
    images: images('campera-bomber-terracota', 3),
    creationAt: '2026-08-18T10:00:00.000Z',
    category: ropa,
  },
  {
    id: 5,
    title: 'Buzo cuello redondo blanco',
    slug: 'buzo-cuello-redondo-blanco',
    description:
      'Buzo de felpa liviana con cuello, puños y cintura en rib. Corte relajado y unisex para usar solo o en capas.',
    price: 42,
    images: images('buzo-cuello-redondo-blanco', 2),
    creationAt: '2026-10-05T10:00:00.000Z',
    category: ropa,
  },

  // Electrónica
  {
    id: 6,
    title: 'Auriculares inalámbricos over-ear',
    slug: 'auriculares-inalambricos',
    description:
      'Auriculares Bluetooth 5.3 con almohadillas acolchadas, hasta 30 horas de batería y micrófono para llamadas. Se pliegan para guardarlos fácil.',
    price: 129,
    images: images('auriculares-inalambricos', 3),
    creationAt: '2026-07-14T10:00:00.000Z',
    category: electronica,
  },
  {
    id: 7,
    title: 'Smartwatch deportivo',
    slug: 'smartwatch-deportivo',
    description:
      'Reloj inteligente con pantalla AMOLED, GPS integrado, monitor de frecuencia cardíaca y sueño. Resiste el agua hasta 50 metros.',
    price: 199,
    images: images('smartwatch-deportivo', 3),
    creationAt: '2026-10-28T10:00:00.000Z',
    category: electronica,
  },
  {
    id: 8,
    title: 'Notebook ultraliviana 14"',
    slug: 'notebook-ultraliviana',
    description:
      'Notebook de aluminio de 1,2 kg con pantalla de 14", 16 GB de RAM y SSD de 512 GB. Batería para una jornada completa de trabajo.',
    price: 899,
    images: images('notebook-ultraliviana', 2),
    creationAt: '2026-06-03T10:00:00.000Z',
    category: electronica,
  },
  {
    id: 9,
    title: 'Parlantes de estante (par)',
    slug: 'parlantes-de-estante',
    description:
      'Par de parlantes activos de dos vías con gabinete de madera, entrada óptica y Bluetooth. Sonido equilibrado para escritorio o living.',
    price: 249,
    images: images('parlantes-de-estante', 3),
    creationAt: '2026-04-22T10:00:00.000Z',
    category: electronica,
  },
  {
    id: 10,
    title: 'Teclado inalámbrico compacto',
    slug: 'teclado-inalambrico',
    description:
      'Teclado de perfil bajo con conexión Bluetooth multidispositivo y batería recargable por USB-C. Teclas silenciosas y distribución en español.',
    price: 59,
    images: images('teclado-inalambrico', 3),
    creationAt: '2026-02-09T10:00:00.000Z',
    category: electronica,
  },

  // Hogar
  {
    id: 11,
    title: 'Sofá de terciopelo verde de 3 cuerpos',
    slug: 'sofa-terciopelo-verde',
    description:
      'Sofá tapizado en terciopelo antimanchas con estructura de madera maciza y patas de roble. Almohadones de espuma de alta densidad.',
    price: 749,
    images: images('sofa-terciopelo-verde', 3),
    creationAt: '2026-05-16T10:00:00.000Z',
    category: hogar,
  },
  {
    id: 12,
    title: 'Silla nórdica negra',
    slug: 'silla-nordica-negra',
    description:
      'Silla de diseño escandinavo con asiento de polipropileno, almohadón de ecocuero y patas de haya. Liviana, firme y fácil de limpiar.',
    price: 89,
    images: images('silla-nordica-negra', 2),
    creationAt: '2026-03-30T10:00:00.000Z',
    category: hogar,
  },
  {
    id: 13,
    title: 'Lámpara de pie articulada',
    slug: 'lampara-de-pie',
    description:
      'Lámpara de pie de acero con pantalla orientable y acabado gris grafito. Luz dirigida para lectura, compatible con lámparas LED E27.',
    price: 119,
    images: images('lampara-de-pie', 3),
    creationAt: '2026-11-10T10:00:00.000Z',
    category: hogar,
  },
  {
    id: 14,
    title: 'Lámpara colgante de metal',
    slug: 'lampara-colgante',
    description:
      'Colgante de chapa pintada con interior blanco que refleja la luz hacia abajo. Cable textil regulable de 1,5 m. Ideal sobre mesas e islas.',
    price: 69,
    images: images('lampara-colgante', 2),
    creationAt: '2026-01-07T10:00:00.000Z',
    category: hogar,
  },
  {
    id: 15,
    title: 'Set de vasos de cerámica artesanal (6)',
    slug: 'set-vasos-ceramica',
    description:
      'Seis vasos de gres esmaltado hechos a mano, cada uno con pequeñas variaciones de color y textura. Aptos para lavavajillas.',
    price: 34,
    images: images('set-vasos-ceramica', 3),
    creationAt: '2026-09-25T10:00:00.000Z',
    category: hogar,
  },

  // Calzado
  {
    id: 16,
    title: 'Zapatillas running negras',
    slug: 'zapatillas-running-negras',
    description:
      'Zapatillas de running con capellada de malla respirable y entresuela de espuma reactiva. Livianas y con buen agarre en asfalto.',
    price: 95,
    images: images('zapatillas-running-negras', 3),
    creationAt: '2026-10-17T10:00:00.000Z',
    category: calzado,
  },
  {
    id: 17,
    title: 'Zapatillas urbanas bordó',
    slug: 'zapatillas-urbanas-bordo',
    description:
      'Zapatillas de lona con puntera reforzada, suela vulcanizada y cordones de algodón. El clásico de skate para el día a día.',
    price: 65,
    images: images('zapatillas-urbanas-bordo', 3),
    creationAt: '2026-06-21T10:00:00.000Z',
    category: calzado,
  },
  {
    id: 18,
    title: 'Borcegos de cuero marrón',
    slug: 'borcegos-cuero',
    description:
      'Borcegos de cuero engrasado con costura reforzada, ojales metálicos y suela de goma antideslizante. Cómodos desde el primer día.',
    price: 149,
    images: images('borcegos-cuero', 3),
    creationAt: '2026-04-04T10:00:00.000Z',
    category: calzado,
  },
  {
    id: 19,
    title: 'Stilettos estampados',
    slug: 'stilettos-estampados',
    description:
      'Zapatos de taco aguja de 9 cm con estampa floral, punta fina y plantilla acolchada. Para ocasiones especiales.',
    price: 110,
    images: images('stilettos-estampados', 3),
    creationAt: '2026-08-01T10:00:00.000Z',
    category: calzado,
  },

  // Accesorios
  {
    id: 20,
    title: 'Anteojos de sol redondos',
    slug: 'anteojos-sol-redondos',
    description:
      'Anteojos con armazón metálico dorado y lentes polarizadas verde oscuro con protección UV400. Incluyen estuche rígido.',
    price: 79,
    images: images('anteojos-sol-redondos', 3),
    creationAt: '2026-11-18T10:00:00.000Z',
    category: accesorios,
  },
  {
    id: 21,
    title: 'Mochila urbana azul',
    slug: 'mochila-urbana',
    description:
      'Mochila de lona resistente al agua con compartimento acolchado para notebook de hasta 15", bolsillo frontal y espalda respirable.',
    price: 64,
    images: images('mochila-urbana', 3),
    creationAt: '2026-02-26T10:00:00.000Z',
    category: accesorios,
  },
  {
    id: 22,
    title: 'Cartera bandolera de cuero',
    slug: 'cartera-bandolera',
    description:
      'Bandolera de cuero suela con tapa imantada, correa regulable y bolsillo interior con cierre. Tamaño justo para lo esencial.',
    price: 85,
    images: images('cartera-bandolera', 3),
    creationAt: '2026-07-29T10:00:00.000Z',
    category: accesorios,
  },
  {
    id: 23,
    title: 'Reloj analógico minimalista',
    slug: 'reloj-analogico',
    description:
      'Reloj de cuarzo con caja de acero de 38 mm, esfera blanca, agujas oro rosa y malla de cuero. Resistente a salpicaduras.',
    price: 139,
    images: images('reloj-analogico', 3),
    creationAt: '2026-05-08T10:00:00.000Z',
    category: accesorios,
  },
  {
    id: 24,
    title: 'Gorra trucker blanca',
    slug: 'gorra-trucker-blanca',
    description:
      'Gorra de cinco paneles con frente de espuma, red trasera respirable y cierre a presión ajustable.',
    price: 22,
    images: images('gorra-trucker-blanca', 2),
    creationAt: '2026-09-12T10:00:00.000Z',
    category: accesorios,
  },
];
