/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F0FE',
          100: '#B8D4F8',
          200: '#8BB8F2',
          300: '#5D9CEC',
          400: '#3A84E6',
          500: '#2A7DE1', // Primary
          600: '#1E6BC4',
          700: '#1558A8',
          800: '#0E458C',
          900: '#073270',
          DEFAULT: '#2A7DE1',
        },
        success: {
          DEFAULT: '#00C9A7',
          light: '#E6F9F5',
          dark: '#009E83',
        },
        danger: {
          DEFAULT: '#FF6B6B',
          light: '#FFF0F0',
          dark: '#E04848',
        },
        warning: {
          DEFAULT: '#FFB800',
          light: '#FFF8E6',
          dark: '#D99B00',
        },
        background: '#F4F7FC',
        text: '#1A2B4C',
        card: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'touch': '44px', // Minimum touch target
      },
      fontSize: {
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(26, 43, 76, 0.08)',
        'card-hover': '0 4px 16px rgba(26, 43, 76, 0.12)',
        'elevated': '0 10px 25px -5px rgba(42, 125, 225, 0.15)',
        'glow-primary': '0 0 15px rgba(42, 125, 225, 0.5)',
        'glow-success': '0 0 15px rgba(0, 201, 167, 0.5)',
        'glow-danger': '0 0 15px rgba(255, 107, 107, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
