/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#004E64',
          shade: '#003646',
          dark: '#00222C',
          translucent: 'rgba(0, 78, 100, 0.4)',
        },
        mist: {
          DEFAULT: '#E0E5E9',
          pure: '#F4F7F9',
          muted: '#8A9AA5',
          border: 'rgba(224, 229, 233, 0.2)',
          'dark-border': 'rgba(0, 78, 100, 0.2)',
        },
      },
      fontFamily: {
        cursive: ['"Alex Brush"', '"Pinyon Script"', 'cursive'],
        display: ['Cinzel', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.35em',
      },
    },
  },
  plugins: [],
}
