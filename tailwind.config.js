/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fffff7',
        lime: {
          100: '#e9fccf',
          200: '#d8fcb3', 
          300: '#b1fcb3',
          400: '#89fcb3'
        }
      }
    }
  },
  plugins: [],
};