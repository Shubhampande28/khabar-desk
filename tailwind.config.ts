import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        paperdim: "rgb(var(--color-paperdim) / <alpha-value>)",
        orange: "#F2622A",
        amber: "#F0A028",
        pink: "#E0457B",
        teal: "#1B9AAA",
        slate: "#45577A",
        blue: "#3B6EA5"
      },
      fontFamily: {
        serif: ["var(--font-headline)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
