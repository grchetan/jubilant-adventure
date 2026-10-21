/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--f-primary, 31 91 65) / <alpha-value>)",
          foreground: "rgb(var(--f-primary-fg, 255 255 255) / <alpha-value>)",
        },
        deep: "rgb(var(--f-deep, 18 55 42) / <alpha-value>)",
        background: "rgb(var(--f-bg, 250 246 237) / <alpha-value>)",
        foreground: "rgb(var(--f-fg, 26 32 28) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--f-card, 255 253 248) / <alpha-value>)",
          foreground: "rgb(var(--f-fg, 26 32 28) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--f-muted, 243 236 222) / <alpha-value>)",
          foreground: "rgb(var(--f-muted-fg, 108 112 103) / <alpha-value>)",
        },
        border: "rgb(var(--f-border, 230 221 204) / <alpha-value>)",
      },
      borderRadius: {
        card: "var(--f-radius, 16px)",
        btn: "var(--f-radius-btn, 10px)",
      },
      boxShadow: {
        card: "var(--f-shadow, 0 1px 2px rgb(15 23 42 / .05), 0 4px 16px rgb(15 23 42 / .05))",
        lift: "var(--f-shadow-lift, 0 12px 32px rgb(15 23 42 / .12))",
      },
      fontFamily: {
        display: ["var(--f-font-display, 'Plus Jakarta Sans', sans-serif)"],
        body: ["var(--f-font-body, 'Inter', sans-serif)"],
        sans: ["var(--f-font-body, 'Inter', sans-serif)"],
      },
    },
  },
  plugins: [],
};
