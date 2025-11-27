/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(250, 100%, 70%)',
          light: 'hsl(250, 100%, 80%)',
          dark: 'hsl(250, 100%, 60%)',
        },
        secondary: {
          DEFAULT: 'hsl(190, 100%, 50%)',
          light: 'hsl(190, 100%, 60%)',
          dark: 'hsl(190, 100%, 40%)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
