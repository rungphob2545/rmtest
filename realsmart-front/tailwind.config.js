/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "mobile-sm": "375px",
      "mobile-md": "425px",
    },
    extend: {},
  },
  plugins: [],
};
