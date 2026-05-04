const { tailwindTheme } = require("@breeze/design-tokens");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/dist/tailwind")],
  theme: {
    extend: {
      ...tailwindTheme,
    },
  },
};
