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
        accent: '#3B82F6', // Botones y links
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
