/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'canesense-green': '#1F4E3D',
        'canesense-light': '#E8F3EF',
      }
    },
  },
  plugins: [],
}
