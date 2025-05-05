/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#1e3a8a",
          dark: "#4338ca",
        },
        secondary: {
          DEFAULT: "#bfdbfe",
          dark: "#4338ca",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
