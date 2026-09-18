/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f5fe',
          100: '#edeafd',
          200: '#ded9fb',
          300: '#c5bef7',
          400: '#a89cf0',
          500: '#8b7ae8',
          600: '#7559dd',
          700: '#6546c4',
          800: '#543b9f',
          900: '#47347f',
          950: '#2b1d52',
        },
        secondary: {
          50: '#f7f9ff',
          100: '#eff4ff',
          200: '#dfe8ff',
          300: '#c5d6ff',
          400: '#a2bcfc',
          500: '#6480f2',
          700: '#5167e6',
          800: '#4555cd',
          900: '#3c4bab',
          950: '#232c66',
        },
        ink: {
          700: '#5B4A9E',
          800: '#47347F',
          900: '#3A2B6B',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 16px rgba(84, 59, 159, 0.06)',
        card: '0 4px 24px rgba(84, 59, 159, 0.08)',
        lifted: '0 12px 32px rgba(84, 59, 159, 0.14)',
      },
    },
  },
  plugins: [],
}
