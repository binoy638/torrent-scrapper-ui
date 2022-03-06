module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#339AF0",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
