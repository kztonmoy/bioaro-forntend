import type { Config } from 'tailwindcss';

// Tokens transcribed from the design review, not invented fresh:
// dark green sidebar + cream canvas, Plus Jakarta Sans / Inter, 8px radius,
// a four-state status scale, and six domain accents.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-jakarta)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#0E2A20', // sidebar / primary buttons
          800: '#153A2C',
          700: '#1C4A38',
        },
        cream: {
          DEFAULT: '#FAF6EE',
          card: '#FFFFFF',
          line: '#E9E3D4',
        },
        status: {
          optimal: '#3E7A52',
          optimalBg: '#E7F1E9',
          watch: '#B4791A',
          watchBg: '#FBEFDC',
          elevated: '#B8433A',
          elevatedBg: '#FBE9E7',
          neutral: '#8B8A82',
          neutralBg: '#EFEDE6',
        },
        domain: {
          inflammation: '#D98E86',
          inflammationBg: '#F7E4E1',
          organ: '#D9A56B',
          organBg: '#F6EADA',
          hormones: '#8E8AC4',
          hormonesBg: '#E9E7F5',
          vitamins: '#C9A227',
          vitaminsBg: '#F6EFD6',
          brain: '#7C89C9',
          brainBg: '#E7EAF6',
          microbiome: '#A6A69B',
          microbiomeBg: '#EDECE5',
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        card: '8px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 20, 15, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
