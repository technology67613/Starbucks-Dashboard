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
          DEFAULT: '#0C5C3D',
          hover: '#094830',
          dark: '#063523',
          tint: '#E7F3EC',
          light: '#F0F8F4',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F6F7F5',
        },
        appBg: '#FAFAF8',
        customText: {
          DEFAULT: '#1A1A1A',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        customBorder: 'rgba(0, 0, 0, 0.08)',
        customSuccess: {
          DEFAULT: '#16A34A',
          bg: '#DCFCE7',
          text: '#15803D',
        },
        customWarning: {
          DEFAULT: '#D97706',
          bg: '#FEF3C7',
          text: '#B45309',
        },
        customError: {
          DEFAULT: '#DC2626',
          bg: '#FEE2E2',
          text: '#B91C1C',
        },
        customInfo: {
          DEFAULT: '#2563EB',
          bg: '#DBEAFE',
          text: '#1D4ED8',
        },
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        img: '12px',
        pill: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
        md: '0 4px 16px rgba(0, 0, 0, 0.06)',
        card: '0 2px 8px rgba(0, 0, 0, 0.04)',
        hover: '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
