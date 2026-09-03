// tailwind.config.js

module.exports = {
  purge: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        accent: '#e74c3c',
        neutral: '#ecf0f1',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};