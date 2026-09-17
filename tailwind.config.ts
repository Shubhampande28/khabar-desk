import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14171C",
        paper: "#F1EEE6",
        paperdim: "#E7E2D4",
        wire: "#C0392B",
        teal: "#2F6F6B",
        mustard: "#C98A2C",
        rose: "#B0456E",
        navy: "#2B4570"
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
