/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#3B1848',
          dark: '#24102E',
          deep: '#1A0A22',
          light: '#5A2D6B',
        },
        cream: {
          DEFAULT: '#F5F1E8',
          dark: '#E8E0D0',
          light: '#FBF8F2',
        },
        gold: {
          DEFAULT: '#D4A24C',
          light: '#E4C078',
          muted: '#B8893A',
        },
        brand: {
          red: '#C41E2E',
          'red-dark': '#8E1420',
          'red-light': '#E8495A',
          maroon: '#3D0E12',
        },
        ink: {
          DEFAULT: '#24102E',
          muted: '#5C4A63',
        },
        success: '#3FA65E',
        warning: '#E0A400',
        error: '#E5484D',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
