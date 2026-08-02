/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        verity: {
          deep: '#021024',
          navy: '#052659',
          slate: '#5483B3',
          border: '#7DA0CA',
          sky: '#C1E8FF',
          lightPill: '#EAF3FB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        sora: ['Sora', 'Inter', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
