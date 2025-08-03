/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sharkBg: '#10141f',      // Fundo principal
        sharkSurface: '#161d2f', // Fundo de cards e inputs
        sharkBlue: '#00bfff',    // Azul neon principal (DeepSkyBlue)
        sharkRed: '#fc4747',      // Cor de erro/alerta
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Definindo Poppins como padrão
      },
    },
  },
  plugins: [],
}