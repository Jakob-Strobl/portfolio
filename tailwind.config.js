/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
import colors from "tailwindcss/colors";

const customUtilities = plugin(({ addUtilities, matchUtilities, theme }) => {
  addUtilities({
    ".text-sub": {
      "font-variant-position": "sub",
    },
    ".text-super": {
      "font-variant-position": "super",
    },
    ".transition-text": {
      "transition-property": "text-shadow",
      "transition-timing-function": "cubic-bezier(.56,.25,.58,.71)",
    },
  });
  matchUtilities(
    {
      "text-stroke": (value) => ({
        "text-shadow": value,
      }),
    },
    {
      values: theme("textStrokes"),
    },
  );
});

export default {
  content: ["./src/**/*.{html,tsx,css}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor", //huh today I learned this was a thing
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      night: {
        black: "#0B0712",
        900: "#13051F",
        800: "#2D0D4A",
        700: "#531787",
        600: "#7821C4", // TODO: see if theres a better tint/shade
        500: "#9743DF",
        400: "#B172E9",
        300: "#CA9CF2",
        200: "#DDBFF8",
        100: "#FDFBFE", // TODO: find a shade inbetween
        white: "$FDFBFE",
      },
    },
    textStrokes: {
      // HINT color, h-offset, v-offset, blur
      sm: "#CA9CF2 0 0 0.25rem",
      md: "#CA9CF2 0 0 0.45rem",
      lg: "#CA9CF2 0 0 0.7rem",
    },
    extend: {
      opacity: {
        88: "0.88",
      },
      screens: {
        // Visually this lines up so the menu doesn't visually "jump" on the threshold value for the 1/5th column
        xs: "480px",
      },
    },
  },
  plugins: [customUtilities],
};
