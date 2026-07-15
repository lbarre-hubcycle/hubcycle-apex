import type { Config } from "tailwindcss";

/**
 * Hubcycle brand system — from "Hubcycle - Brandbook 2025".
 * Main colors (RGB): deep teal 0/65/79, coral 255/104/77, light blue 161/208/219,
 * lavender 212/182/255, ink 15/32/36, grey 242/242/242, white.
 * Typography: PP Valve (headings, sparingly), Manrope (body).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: "#00414F",
        coral: "#FF684D",
        sky: "#A1D0DB",
        lavender: "#D4B6FF",
        ink: "#0F2024",
        cloud: "#F2F2F2",
      },
      fontFamily: {
        heading: ["var(--font-valve)", "var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
