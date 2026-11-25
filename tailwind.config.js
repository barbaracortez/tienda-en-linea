const defaultTheme = require('tailwindcss/defaultTheme');

/**
 * Tema "oscuro refinado". Todas las combinaciones de texto cumplen WCAG AA
 * (mínimo 5,5:1) sobre canvas, surface y raised.
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0E0E10', // Fondo principal
        surface: '#17171A', // Tarjetas y paneles
        raised: '#1F1F23', // Elementos elevados (inputs, hover)
        line: {
          DEFAULT: '#2C2C31', // Separadores sutiles (decorativos)
          strong: '#45454C', // Bordes de tarjetas
          field: '#76716A', // Bordes de campos de formulario (3:1, WCAG 1.4.11)
        },
        fg: {
          DEFAULT: '#F2EFE9', // Texto principal, blanco cálido (16,8:1)
          muted: '#B4AEA5', // Texto secundario (8,8:1)
          subtle: '#9A948B', // Texto terciario (6,4:1)
        },
        gold: {
          DEFAULT: '#D8BC8E', // Acento: botones, links, foco (10,6:1)
          light: '#E6CFA6', // Hover de botones
        },
        error: '#F4A49A',
        success: '#9FD3AE',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Fraunces', ...defaultTheme.fontFamily.serif],
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
      boxShadow: {
        soft: '0 24px 48px -24px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};
