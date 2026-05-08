/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          black: '#0a0a0f',
          dark: '#121218',
          gray: '#1a1a24',
          muted: '#2a2a3a',
          border: '#3a3a4a',
          text: '#e0e0e8',
          green: '#00ff88',
          red: '#ff4466',
          yellow: '#ffcc00',
          blue: '#0088ff',
        },
        'accent-green': '#00ff88',
        'accent-cyan': '#00d4ff',
        'accent-amber': '#ffb800',
        'accent-red': '#ff4444',
        'accent-blue': '#0088ff',
      },
      animation: {
        'scan': 'scan 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { opacity: '0.3', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(2px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}