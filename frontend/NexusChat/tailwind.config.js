/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss,css}",
  ],
  theme: {
    extend: {},
    colors: {
      dark: {
        900: '#181818',
        800: '#1c1c1c',
        700: '#202020',
        600: '#404040',
        500: '#606060',
        400: '#808080',
        300: '#c0c0c0',
        200: '#e0e0e0',
        100: '#e8e8e8',
        50: '#f0f0f0',
      },
      brown: {
        900: '#14110f', 
        800: '#27221e',
        700: '#4d443c',
        600: '#9a8777',
        500: '#ad9d8d',
        400: '#c0b3a2',
        300: '#d3cab9',
        200: '#ddd6c4',
        100: '#e2daca' 
      }
    },
    screens: {
      'xs': '100%',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl':'2560px'
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        xs: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '4.5rem',
        xl: '5rem',
      },
    },
  },
  plugins: [],
};
