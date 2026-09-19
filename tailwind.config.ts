import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
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
        crime: "#b91c1c",
        entertainment: "#9333ea",
        bollywood: "#db2777",
        hollywood: "#2563eb",
        business: "#0f766e",
        markets: "#15803d",
        startups: "#4338ca",
        politics: "#334155"
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
