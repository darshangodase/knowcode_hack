/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",   /* This array woks like it trying to find content in index and src files */
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

