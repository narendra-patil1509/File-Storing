/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          base: '#002b36',
          surface: '#073642',
          surfaceHighlight: '#1f4853',
          text: '#839496',
          textMuted: '#586e75',
          textBright: '#93a1a1',
          cyan: '#2aa198',
          yellow: '#b58900',
          red: '#dc322f',
          magenta: '#d33682',
          violet: '#6c71c4',
          blue: '#268bd2',
          green: '#859900'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
