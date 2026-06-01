/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wf: {
          dark: '#060c14',
          surface: '#0d1520',
          elevated: '#121a26',
          cyan: '#33ffb5',
          teal: '#3dd6f5',
          violet: '#6040ff',
          pink: '#ff4081',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'wf-gradient': 'linear-gradient(135deg, #33ffb5 0%, #3dd6f5 50%, #6040ff 100%)',
        'wf-gradient-soft': 'linear-gradient(135deg, rgba(51,255,181,0.15) 0%, rgba(96,64,255,0.12) 100%)',
      },
      boxShadow: {
        wf: '0 0 24px rgba(51, 255, 181, 0.15)',
        'wf-lg': '0 8px 32px rgba(51, 255, 181, 0.12)',
      },
    },
  },
  plugins: [],
};
