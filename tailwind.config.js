/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Black: "#161616",
        mediumBlack: "#212121",
        normalBlack: "#272727",
        lightBlack: " #1e1e1e",
        slateGray: "",
        gray: "#616161",
        lightGray: "#acacac",
        khaki: "#C9A24D",
        whiteSmoke: "#f8f6f3",
      },
      fontFamily: {
        Garamond: ["Cormorant Garamond", "serif"],
        Lora: ["Lora", "serif"],
      },
      screens: {
        esm: "480px",
        // sm: "576px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1400px",
        "3xl": "1600px ",
        "4xl": "1700px",
        // 1400-1600, 1300-1399,1200-1299,992-1199(1170),768-991,600-767,480-599,320-479
      },
      lineHeight: {},
      boxShadow: {
        custom: "0px 5px 15px rgba(204, 204, 204, 0.25)",
      },
      keyframes: {
        "loading-shimmer": {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        "loading-shimmer": "loading-shimmer 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
