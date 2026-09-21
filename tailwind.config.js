/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand scales are RGB-triplet CSS variables (see src/index.css) so
        // light and dark themes override the same tokens AND opacity
        // modifiers (bg-primary-50/60 …) keep working.
        primary: {
          50: 'rgb(var(--sdc-primary-50) / <alpha-value>)',
          100: 'rgb(var(--sdc-primary-100) / <alpha-value>)',
          200: 'rgb(var(--sdc-primary-200) / <alpha-value>)',
          300: 'rgb(var(--sdc-primary-300) / <alpha-value>)',
          400: 'rgb(var(--sdc-primary-400) / <alpha-value>)',
          500: 'rgb(var(--sdc-primary-500) / <alpha-value>)',
          600: 'rgb(var(--sdc-primary-600) / <alpha-value>)',
          700: 'rgb(var(--sdc-primary-700) / <alpha-value>)',
          800: 'rgb(var(--sdc-primary-800) / <alpha-value>)',
          900: 'rgb(var(--sdc-primary-900) / <alpha-value>)',
          950: 'rgb(var(--sdc-primary-950) / <alpha-value>)',
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
          700: 'rgb(var(--sdc-ink-700) / <alpha-value>)',
          800: 'rgb(var(--sdc-ink-800) / <alpha-value>)',
          900: 'rgb(var(--sdc-ink-900) / <alpha-value>)',
        },
        // Readable lavender accent for TEXT/ICONS on tinted surfaces; flips to
        // a light lavender in dark mode. Primary-600/700 stay dark-violet in
        // dark mode because they are button/gradient fills with white text.
        accent: {
          DEFAULT: 'rgb(var(--sdc-accent) / <alpha-value>)',
          strong: 'rgb(var(--sdc-accent-strong) / <alpha-value>)',
          600: 'rgb(var(--sdc-accent-600) / <alpha-value>)',
        },
        // Page background vs elevated card/panel surface vs input surface.
        app: 'rgb(var(--sdc-app) / <alpha-value>)',
        surface: 'rgb(var(--sdc-surface) / <alpha-value>)',
        'surface-input': 'rgb(var(--sdc-surface-input) / <alpha-value>)',
        // Neutral scale maps to slate so every existing slate utility themes
        // itself (text, borders, subtle backgrounds, modal overlays).
        slate: {
          50: 'rgb(var(--sdc-neutral-50) / <alpha-value>)',
          100: 'rgb(var(--sdc-neutral-100) / <alpha-value>)',
          200: 'rgb(var(--sdc-neutral-200) / <alpha-value>)',
          300: 'rgb(var(--sdc-neutral-300) / <alpha-value>)',
          400: 'rgb(var(--sdc-neutral-400) / <alpha-value>)',
          500: 'rgb(var(--sdc-neutral-500) / <alpha-value>)',
          600: 'rgb(var(--sdc-neutral-600) / <alpha-value>)',
          700: 'rgb(var(--sdc-neutral-700) / <alpha-value>)',
          800: 'rgb(var(--sdc-neutral-800) / <alpha-value>)',
          900: 'rgb(var(--sdc-neutral-900) / <alpha-value>)',
          950: 'rgb(var(--sdc-neutral-950) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 16px var(--sdc-shadow-soft)',
        card: '0 4px 24px var(--sdc-shadow-card)',
        lifted: '0 12px 32px var(--sdc-shadow-lifted)',
      },
    },
  },
  plugins: [],
}
