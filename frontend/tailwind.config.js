/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080C14',
          surface: '#0D1B2A',
        },
        accent: {
          cyan: '#00D4FF',
          azure: '#0078D4',
        },
        status: {
          success: '#10F5A0',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        text: {
          primary: '#E4E7EB',
          secondary: '#8B92A0',
          muted: '#4B5563',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s infinite',
      },
    },
  },
  plugins: [],
};
