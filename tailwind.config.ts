import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF8F5',
        card: '#FFFFFF',
        terra: {
          DEFAULT: '#B87356',
          bg: 'rgba(184,115,86,0.08)',
        },
        sage: {
          DEFAULT: '#8FA37A',
          bg: 'rgba(143,163,122,0.10)',
        },
        text: '#2D2A26',
        sub: '#8C857D',
        muted: '#B5AFA8',
        border: '#EBE6E0',
        'border-l': '#F3EFEA',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        mobile: '430px',
      },
      borderRadius: {
        pill: '100px',
        card: '20px',
        input: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
