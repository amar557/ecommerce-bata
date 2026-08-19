/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary1: "#C1CBFB",
        deepRed: {
          DEFAULT: "#7A0A0A",
          50: "#F8EFEF",
          100: "#F0DADA",
          200: "#E0B5B5",
          300: "#C97A7A",
          400: "#A83A3A",
          500: "#8B1212",
          600: "#7A0A0A",
          700: "#5C0808",
          800: "#450606",
          900: "#2E0404",
        },
      },
    },
  },
  plugins: [],
};
