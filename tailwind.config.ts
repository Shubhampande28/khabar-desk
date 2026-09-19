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
        inkSoft: "rgb(var(--color-ink-soft) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        paperdim: "rgb(var(--color-paperdim) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        trust: "rgb(var(--color-trust-bg) / <alpha-value>)",
        trustText: "rgb(var(--color-trust-text) / <alpha-value>)",
        accent: "#ea580c",
        amber: "#F0A028",
        pink: "#E0457B",
        teal: "#1B9AAA",
        slate: "#45577A",
        blue: "#3B6EA5"
      },
      fontFamily: {
        serif: ["var(--font-headline)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
