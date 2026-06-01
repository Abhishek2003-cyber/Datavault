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
          DEFAULT: "#02040a", // Deepest navy
          surface: "#0a0e17", // Midnight blue surface
          elevated: "#111827", // Lighter navy for cards
          border: "#1e293b",
          "border-2": "#334155",
        },
        accent: {
          cyan: "#00f0ff", // Electric cyan
          "cyan-dim": "#00b8cc",
          violet: "#8b5cf6", // Subtle violet accent
          green: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
        },
        text: {
          primary: "#f8fafc",
          secondary: "#94a3b8",
          tertiary: "#64748b",
          mono: "#38bdf8",
        },
      },
      fontFamily: {
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      boxShadow: {
        "glow-cyan": "0 0 40px -10px rgba(0, 240, 255, 0.4)",
        "glow-cyan-lg": "0 0 80px -20px rgba(0, 240, 255, 0.3)",
        "glow-violet": "0 0 40px -10px rgba(139, 92, 246, 0.4)",
        "glass-panel": "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        "glass-inset": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(ellipse at center, rgba(0,240,255,0.05) 0%, transparent 70%)",
        "cyber-gradient": "linear-gradient(135deg, rgba(0,240,255,0.1) 0%, rgba(139,92,246,0.1) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "data-stream": "dataStream 20s linear infinite",
        "scan-line": "scanLine 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        dataStream: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        scanLine: {
          "0%": { top: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
