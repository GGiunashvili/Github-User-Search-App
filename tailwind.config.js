/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Include index.html
    "./src/**/*.{js,ts,jsx,tsx}", // Include all React files
  ],
  theme: {
    extend: {
      container: {
        center: true,

        padding: "2rem",
      },
      screens: {
        lg: "730px",
      },
    },
  },
  plugins: [],
};
