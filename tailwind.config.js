/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dnd: {
          dark: '#0d1117',
          surface: '#161b22',
          card: '#1e2430',
          border: '#30363d',
          accent: '#d97706', // amber-600
          gold: '#f59e0b',
          crimson: '#dc2626',
          mana: '#2563eb',
          emerald: '#059669',
          purple: '#7c3aed'
        }
      },
      fontFamily: {
        fantasy: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
