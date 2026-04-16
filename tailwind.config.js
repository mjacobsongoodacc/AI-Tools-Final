/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FAFAFA',
        ink: {
          0: '#000000',
          50: '#0A0A0A',
          100: '#141414',
        },
        bone: {
          100: '#FAFAFA',
          70: 'rgba(250,250,250,0.70)',
          40: 'rgba(250,250,250,0.40)',
          25: 'rgba(250,250,250,0.25)',
          15: 'rgba(250,250,250,0.15)',
          10: 'rgba(250,250,250,0.10)',
          5: 'rgba(250,250,250,0.05)',
        },
        accent: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
        flag: '#EF4444',
        confidence: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
