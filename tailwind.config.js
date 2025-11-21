/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        night: '#0A0F1F',        // Fondo principal azul noche
        nightLight: '#1A2035',  // Fondo secundario
        nightBorder: '#2A3048', // Bordes suaves elegantes
        accent: '#3B82F6',      // Azul elegante para botones / links
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
