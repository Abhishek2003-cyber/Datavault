import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#08090b",
          surface: "#0f1117",
          elevated: "#161a23",
          border: "#1c2130",
          "border-2": "#252d3d",
        },
        accent: {
          cyan: "#00d4ff",
          "cyan-dim": "#0099bb",
          green: "#00ff88",
          amber: "#ffaa00",
          red: "#ff4060",
        },
        text: {
          primary: "#e2e8f5",
          secondary: "#6b7a99",
          tertiary: "#3d4a63",
          mono: "#4ade80",
        },
      },
      fontFamily: {
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
