import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "70%": { opacity: "1", transform: "scale(1.03)" },
          "100%": { transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px) rotate(-1deg)" },
          "75%": { transform: "translateX(4px) rotate(1deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.45s ease-out forwards",
        "pop-in": "pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        wiggle: "wiggle 0.35s ease-in-out 2",
        "wiggle-soft":
          "wiggle 1.15s ease-in-out infinite",
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
