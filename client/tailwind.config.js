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
      "black": "#000000",
      "red": "#ef4444"
    },
    
    extend: {
      animation: {
        bounce200: 'bounce 1s infinite 200ms',
        bounce400: 'bounce 1s infinite 400ms',
    },
    }
  },
  plugins: [],
}
