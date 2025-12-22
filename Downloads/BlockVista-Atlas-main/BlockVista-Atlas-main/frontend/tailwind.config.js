/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-bg': '#0a0e1a',
        'terminal-surface': '#151b2e',
        'terminal-border': '#1f2937',
        'terminal-accent': '#3b82f6',
        'terminal-text': '#e5e7eb',
        'terminal-text-muted': '#9ca3af',
        'terminal-success': '#10b981',
        'terminal-warning': '#f59e0b',
        'terminal-error': '#ef4444',
      },
    },
  },
  plugins: [],
}
