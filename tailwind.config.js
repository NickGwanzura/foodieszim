/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        condensed: ['var(--font-condensed)', 'system-ui', 'sans-serif'],
      },
      colors: {
        carbon: {
          background: '#f4f4f4',
          'background-hover': '#e8e8e8',
          'layer-01': '#ffffff',
          'layer-02': '#f4f4f4',
          'layer-03': '#e0e0e0',
          'border-subtle': '#e0e0e0',
          'border-strong': '#8d8d8d',
          'text-primary': '#161616',
          'text-secondary': '#525252',
          'text-placeholder': '#a8a8a8',
          interactive: '#0f62fe',
          'interactive-hover': '#0353e9',
          'support-success': '#24a148',
          'support-warning': '#f1c21b',
          'support-error': '#da1e28',
          'support-info': '#0043ce',
        },
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'slide-in': 'slide-in 0.25s ease forwards',
        'slide-out': 'slide-out 0.2s ease forwards',
        'fade-in': 'fade-in 0.2s ease forwards',
      },
      keyframes: {
        'slide-in': {
          from: { transform: 'translateX(20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out': {
          from: { opacity: '1', transform: 'translateX(0)' },
          to: { opacity: '0', transform: 'translateX(20px)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
