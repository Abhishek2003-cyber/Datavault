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
        ivory: {
          50: '#fdfaf4',
          100: '#f5f0e8',
          200: '#ede7db',
          300: '#d4c9b4',
        },
        copper: {
          300: '#d4a97a',
          400: '#c4895a',
          500: '#a0622a',
          600: '#8a521f',
        },
        ink: {
          900: '#1a1612',
          700: '#3d3530',
          500: '#6b6055',
          300: '#9a9080',
          200: '#b0a898',
          100: '#c9bfaf',
        },
      },
      fontFamily: {
        mono: ["var(--font-dm-mono)", "monospace"],
        sans: ["var(--font-jost)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      }
    },
  },
  plugins: [],
};
export default config;
