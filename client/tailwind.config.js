/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0d0f14',
        surface: '#111827',
        border: '#1f2937',
        accent: {
          from: '#a855f7',
          to: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(168,85,247,0.15), 0 8px 24px -4px rgba(168,85,247,0.35)',
        'glow-pink': '0 8px 24px -4px rgba(236,72,153,0.35)',
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 20px -8px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        xl2: '18px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out both',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
