/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pranay: {
          dark: '#0b0b0f',
          card: '#16161f',
          cardHover: '#20202e',
          red: '#E50914',
          redDark: '#B80610',
          redGlow: 'rgba(229, 9, 20, 0.45)',
          gold: '#FFD700',
          goldGlow: 'rgba(255, 215, 0, 0.4)',
          gray: {
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827'
          }
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(229, 9, 20, 0.55)',
        'glow-gold': '0 0 25px rgba(255, 215, 0, 0.55)',
      }
    },
  },
  plugins: [],
}

