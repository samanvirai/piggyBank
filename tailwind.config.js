/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lora': ['Lora', ...defaultTheme.fontFamily.serif],
        'roboto': ['Roboto', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
