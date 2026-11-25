const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        night: '#0A0F1F', // Fondo principal azul noche
        nightLight: '#1A2035', // Superficies (tarjetas, paneles)
        nightBorder: '#2A3048', // Bordes suaves
        accent: {
          DEFAULT: '#2563EB', // Fondos de botones (blanco encima: 5.2:1)
          light: '#60A5FA', // Texto y links sobre el fondo oscuro (7.5:1)
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
