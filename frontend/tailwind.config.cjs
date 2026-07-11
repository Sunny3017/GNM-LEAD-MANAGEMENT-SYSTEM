
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F8FAFC', // Light, clean background
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#1E40AF', // Deep blue for premium feel
          500: '#1E3A8A',
          600: '#1E293B', // Slate for text
          700: '#0F172A',
          800: '#020617',
        },
        accent: {
          50: '#FDF4FF',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#DB2777',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        'card': '0 10px 40px -10px rgba(30, 64, 175, 0.12)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.5rem',
      },
      letterSpacing: {
        'tight': '-0.025em',
        'wider': '0.025em',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
