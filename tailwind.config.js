/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx,css}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor", //huh today I learned this was a thing
      black: "#000000",
      white: "#ffffff",
      gray: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
        950: "#030712",
      },
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
        white: "#FDFBFE",
      },
    },
    textStrokes: {
      // HINT color, h-offset, v-offset, blur
      sm: "#CA9CF2 0 0 0.25rem",
      md: "#CA9CF2 0 0 0.45rem",
      lg: "#CA9CF2 0 0 0.7rem",
    },
    extend: {
      opacity: { 88: "0.88" },
      screens: {
        // Visually this lines up so the menu doesn't visually "jump" on the threshold value for the 1/5th column
        xs: "480px",
      },
      transitionProperty: { rect: "height, width, top, left" },
    },
  },
  plugins: [
    function ({ addUtilities, matchUtilities, theme }) {
      addUtilities({
        ".text-sub": { "font-variant-position": "sub" },
        ".text-super": { "font-variant-position": "super" },
        ".transition-text": {
          "transition-property": "text-shadow",
          "transition-timing-function": "cubic-bezier(.56,.25,.58,.71)",
        },
      });
      matchUtilities(
        { "text-stroke": (value) => ({ "text-shadow": value }) },
        { values: theme("textStrokes") },
      );
    },
  ],
};
