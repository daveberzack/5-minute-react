/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}', // adjust paths to match your project structure
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          800: '#333366',
          600: '#666699'
        },
      },
    },
  },
  plugins: [],
}

