/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      screens: { 'xs': '360px', 'xxs': '320px' },
      colors: { 
        primary: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' }, 
        accent: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' } 
      },
      ringColor: {
        primary: '#818cf8',
      },
      ringOpacity: {
        primary: '0.5',
      },
      animation: { 'slide-up': 'slideUp 0.5s ease-out' },
      keyframes: { slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } } },
    },
  },
  plugins: [],
}