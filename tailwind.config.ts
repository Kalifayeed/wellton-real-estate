import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand — deep forest/emerald green (trust, quality, property expertise, Nairobi greenery).
        brand: {
          50: '#f0f7f2',
          100: '#dbede1',
          200: '#badbc8',
          300: '#8cc2a8',
          400: '#5ba383',
          500: '#3b8668',
          600: '#2b6b53',
          700: '#245744',
          800: '#1e4638',
          900: '#1a3a2f',
          950: '#0c201a',
        },
        // Warm stone neutrals for premium, calm layouts.
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Subtle amber accent for premium touches (featured badges, highlights).
        gold: {
          50: '#fbf7eb',
          100: '#f6ecce',
          200: '#edd89f',
          300: '#e2bd64',
          400: '#d9a63b',
          500: '#c98d2b',
          600: '#ad6f24',
          700: '#8a5221',
          800: '#714221',
          900: '#5f371f',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(28,25,23,0.04), 0 4px 16px 0 rgba(28,25,23,0.06)',
        'card-hover': '0 2px 4px 0 rgba(28,25,23,0.05), 0 12px 32px 0 rgba(28,25,23,0.12)',
      },
      borderRadius: {
        // Slightly refined but not over-rounded.
        card: '0.75rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
