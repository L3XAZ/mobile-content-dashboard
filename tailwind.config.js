/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
    './shared/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F6A04D',
        },
        success: {
          DEFAULT: '#009B69',
        },
        error: {
          DEFAULT: '#D63C41',
        },
        gray: {
          light: '#F2F3F5',
          text: '#858C94',
          icon: '#606773',
          placeholder: '#AAAAAA',
        },
        base: {
          white: '#FFFFFF',
          black: '#000000',
        },
      },
    },
  },
  plugins: [],
};
