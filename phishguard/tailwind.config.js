const theme = require('./src/styles/theme').default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      boxShadow: theme.shadows,
      borderRadius: theme.borderRadius,
      animation: theme.animation,
      keyframes: theme.keyframes,
      backgroundImage: theme.gradients,
    },
  },
  plugins: [],
} 