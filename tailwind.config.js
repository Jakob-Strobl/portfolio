/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{html,tsx,css}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor", // huh today I learned this was a thing
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      night: {
        black: "#0B0712",
        900: "#13051F",
        800: "#2D0D4A",
        700: "#531787",
        600: "#7821C4", // TODO see if theres a better tint/shade
        500: "#9743DF",
        400: "#B172E9",
        300: "#CA9CF2",
        200: "#DDBFF8",
        100: "#FDFBFE", // TODO find a shade inbetween
        white: "$FDFBFE",
      },
    },
    extend: {
      opacity: {
        88: "0.88",
      },
    },
  },
  plugins: [],
};
