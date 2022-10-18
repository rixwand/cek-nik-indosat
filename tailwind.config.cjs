/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      viga: ["Viga", "sans-serif"],
      nordique: ["NordiquePro-Bold", "sans-serif"],
    },
    container: {
      // you can configure the container to be centered
      center: true,

      // or have default horizontal padding
      padding: "1rem",

      // default breakpoints but with 40px removed
      screens: {
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1240px",
        "2xl": "1496px",
      },
    },
    extend: {
      colors: {
        primary: "#f1ca00",
      },
    },
  },
  plugins: [],
};
