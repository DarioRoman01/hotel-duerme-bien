/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      "primary": "#0c273f",
      "secondary": "#d69f5b",
      "last": "#EBEBEB",
      "contrast": "#2f4a62",
      "black": "#000000"
    },
    
    extend: {
      inset: {
        '1/100': '10%',
      }
    }
  },
  plugins: [],
}
