/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#010101',
          surface: '#080808',
        },
        accent: {
          cyan: '#FFB86B',
          azure: '#E86F2D',
        },
        status: {
          success: '#7EE787',
          warning: '#F2B84B',
          error: '#FF6B6B',
        },
        text: {
          primary: '#F4F1EA',
          secondary: '#A9A39A',
          muted: '#6E675F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        display: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s infinite',
      },
    },
  },
  plugins: [],
};
