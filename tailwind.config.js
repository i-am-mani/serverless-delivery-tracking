const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        ...colors,
      },
      maxHeight: {
        min: "min-content",
        sm: "8rem",
        md: "16rem",
        lg: "35rem",
        xl: "48rem",
      },
      minHeight: {
        min: "min-content",
        sm: "8rem",
        md: "16rem",
        lg: "35rem",
        xl: "48rem",
      },
      minWidth: {
        xs: "4rem",
        sm: "8rem",
        md: "16rem",
        lg: "35rem",
        xl: "48rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
