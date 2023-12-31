/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#761BE4",
      },
    },
    container: {
      padding: "2rem",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
