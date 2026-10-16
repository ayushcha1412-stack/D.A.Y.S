/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f0',
          100: '#d8ecd8',
          200: '#b0d8b0',
          300: '#7fbf7f',
          400: '#52a052',
          500: '#2d7a2d',
          600: '#1e5c1e',
          700: '#154515',
          800: '#0d2e0d',
          900: '#061806',
        },
        emerald: {
          deep: '#0a3d2e',
          dark: '#0d4a38',
          mid:  '#115c45',
          light:'#176e52',
        },
        gold: {
          light: '#f5d98b',
          DEFAULT: '#d4a843',
          dark:  '#a07828',
          antique:'#c8960c',
          bronze: '#8b6914',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          warm:   '#ede5d4',
          dark:   '#d4c9b0',
        },
        earth: {
          DEFAULT: '#6b4c2a',
          light:  '#8b6340',
          dark:   '#4a3018',
        },
        charcoal: {
          DEFAULT: '#1a1a2e',
          light:  '#252540',
          mid:    '#2d2d50',
        },
        sand: '#c9b08a',
        parchment: '#f0e6c8',
      },
      fontFamily: {
        serif:   ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Serif Devanagari"', 'serif'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 10s ease-in-out infinite',
        'spin-slow':   'spin 20s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
        'pulse-gold':  'pulseGold 2s ease-in-out infinite',
        'orb-glow':    'orbGlow 4s ease-in-out infinite',
        'particle':    'particle 8s linear infinite',
        'leaf-fall':   'leafFall 12s ease-in-out infinite',
        'draw-line':   'drawLine 2s ease-out forwards',
        'mandala-spin':'mandalaSpin 30s linear infinite',
        'breathe':     'breathe 4s ease-in-out infinite',
        'shimmer':     'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212,168,67,0.3)' },
          '50%':      { boxShadow: '0 0 30px rgba(212,168,67,0.7), 0 0 60px rgba(212,168,67,0.3)' },
        },
        orbGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
        particle: {
          '0%':   { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
        leafFall: {
          '0%':   { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' },
          '10%':  { opacity: '0.7' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        drawLine: {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        mandalaSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)',    opacity: '0.8' },
          '50%':      { transform: 'scale(1.08)', opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-shimmer':    'linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        'gold':       '0 0 20px rgba(212,168,67,0.4)',
        'gold-lg':    '0 0 40px rgba(212,168,67,0.5)',
        'emerald':    '0 0 20px rgba(17,92,69,0.5)',
        'mystical':   '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,168,67,0.2)',
        'prana':      '0 0 60px rgba(212,168,67,0.3), 0 0 120px rgba(17,92,69,0.2)',
      },
    },
  },
  plugins: [],
}
