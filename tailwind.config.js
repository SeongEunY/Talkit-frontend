/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
      },
      colors: {
        primary: '#A5F278',
        secondary: '#7AADFE',
        text: {
          100: '#fff',
          300: '#888',
          400: '#999',
          500: '#666',
          600: '#222',
          900: '#000',
        },
      },
    },
  },
  plugins: [],
};
