import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "#6C63FF",
          light: "#F0EFFF",
          border: "#C4C0FF",
          text: "#1A1A2E",
          muted: "#6B6B80",
        }
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        btn: "8px",
        badge: "99px",
      },
      boxShadow: {
        premium: "0 2px 12px rgba(108, 99, 255, 0.07)",
      }
    },
  },
  plugins: [],
};
export default config;
