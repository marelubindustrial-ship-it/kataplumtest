import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Kataplum (morado / amarillo / rosa sobre cielo)
        tinta: "#161b32",
        uva: "#5d2260",
        morado: "#974292",
        rosa: "#f2979b",
        sol: "#ffd93b",
        dorado: "#f0a208",
        cielo: "#a1d9f7",
        nube: "#f4f7ff",
        crema: "#fff9e8",
        mar: "#3d9be9",
      },
      fontFamily: {
        display: ["var(--font-baloo)", "cursive"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      boxShadow: {
        sticker: "0 4px 0 0 #161b32",
        "sticker-lg": "0 8px 0 0 #161b32",
        "sticker-sm": "0 3px 0 0 #161b32",
      },
      borderWidth: {
        sticker: "4px",
      },
      keyframes: {
        flotar: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-12px) rotate(1deg)" },
        },
        aparicion: {
          from: { opacity: "0", transform: "translateY(24px) scale(.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        escribir: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        flotar: "flotar 5s ease-in-out infinite",
        aparicion: "aparicion .5s ease-out both",
        escribir: "escribir 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
