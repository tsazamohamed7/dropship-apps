/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // indigo
        accent: "#22d3ee",  // cyan
        dark: "#020617"
      },
    },
  },
  plugins: [],
};
