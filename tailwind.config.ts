import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F5F0E8',
          dark: '#EDE7DA',
          card: '#FDFBF7',
        },
        ink: {
          DEFAULT: '#3D2E1E',
          secondary: '#6B5A47',
          muted: '#9B8C7A',
        },
        gold: {
          DEFAULT: '#C4962C',
          light: '#E8D5A3',
        },
        border: '#D4C9B8',
        seal: {
          red: '#C4453C',
          white: '#E8E2D6',
          blue: '#4A7FB5',
          yellow: '#D4A843',
        },
      },
      fontFamily: {
        serif: ['Georgia', '"Playfair Display"', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(61, 46, 30, 0.08)',
        golden: '0 0 20px rgba(196, 150, 44, 0.3)',
        'golden-lg': '0 0 30px rgba(196, 150, 44, 0.25)',
      },
      keyframes: {
        slideIn: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        slideUp: { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
