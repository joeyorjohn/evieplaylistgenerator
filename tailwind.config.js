const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      pink: colors.pink,
      red: colors.red,
      yellow: colors.yellow,
      green: {
        DEFAULT: "#1DB954",
      },
      gray: {
        DEFAULT: "#191414",
      },
    },
    extend: {
      zIndex: {
        "-10": "-10",
      },
      fontFamily: {
        title: ["Benn", ...fontFamily.sans],
        sans: ["Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: ["postcss-import", "tailwindcss", "autoprefixer"],
};
