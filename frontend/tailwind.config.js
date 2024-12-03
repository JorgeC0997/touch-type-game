/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          dark: "#222831",
          neutral: "#393E46",
          light: "#EEEEEE",
        },
        primary: "#D65A31",
      },
    },
  },
  plugins: [],
};
