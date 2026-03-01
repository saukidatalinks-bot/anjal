/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          mid: '#112240',
          light: '#1a3a6b',
        },
        brand: {
          green: '#16A34A',
          'green-light': '#22c55e',
          'green-pale': '#dcfce7',
          gold: '#c9a84c',
        },
        apple: {
          'dark': '#1d1d1d',
          'dark-secondary': '#424245',
          'light': '#f5f5f7',
          'light-secondary': '#e5e5e7',
          'space-gray': '#555555',
          'silver': '#f5f5f7',
          'blue': '#0071e3',
          'blue-hover': '#0077ed',
        },
      },
      backgroundImage: {
        'apple-gradient': 'linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%)',
        'apple-gradient-subtle': 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
        'apple-dark-gradient': 'linear-gradient(180deg, #1d1d1d 0%, #242424 100%)',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out infinite 3s',
        'marquee': 'marquee 25s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease forwards',
        'blob': 'blob 7s infinite',
        'blob-delay-2000': 'blob 7s infinite 2s',
        'blob-delay-4000': 'blob 7s infinite 4s',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'pulse-dot': { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.5, transform: 'scale(0.8)' } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
    },
  },
  plugins: [],
}
