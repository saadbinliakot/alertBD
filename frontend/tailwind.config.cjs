/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          600: "#9A1B30",
          700: "#800020",
          800: "#66001A",
        },
      },
    },
  },
  plugins: [],
}
