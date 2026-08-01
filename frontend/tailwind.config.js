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
        qount: {
          bg: '#161616',
          card: '#222222',
          cardBorder: '#2e2e2e',
          lime: '#d0f347',
          limeHover: '#beeb30',
          darkText: '#141414',
          muted: '#9ca3af',
        },
        paper: {
          DEFAULT: '#EEF0EC',
          alt: '#E3E6DE',
        },
        forest: {
          dark: '#14231C',
        },
        evidence: {
          green: '#1F6D4C',
          greenLight: 'rgba(31, 109, 76, 0.12)',
        },
        flag: {
          amber: '#C98A2B',
          amberLight: 'rgba(201, 138, 43, 0.12)',
        },
        danger: '#B4432F',
        divider: '#C7CCC2',
        mutedGreen: '#5B665D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
