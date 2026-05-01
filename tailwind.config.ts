import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Montserrat", "system-ui", "sans-serif"],
        devanagari: ["var(--font-devanagari)", "Mukta", "Noto Sans Devanagari", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          DEFAULT: "#386AF6",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C3D2FC",
          300: "#84A2F4",
          400: "#345CCC",
          500: "#386AF6",
          600: "#1339A3",
          700: "#2B3E8B",
          800: "#041B5B"
        },
        ink: {
          DEFAULT: "#0E0E0E",
          muted: "#7383A5",
          subtle: "#828996",
          disabled: "#999999"
        },
        surface: {
          DEFAULT: "#FFFFFF",
          app: "#ECECEC",
          subtle: "#F4F6FA"
        },
        line: {
          DEFAULT: "#D5D8DF",
          subtle: "#ECECEC",
          strong: "#999999"
        },
        success: {
          DEFAULT: "#00BA34",
          subtle: "#D4F5DC",
          ink: "#007B22"
        },
        warning: {
          DEFAULT: "#F8B200",
          subtle: "#FFF3CC",
          ink: "#9A6500"
        },
        danger: {
          DEFAULT: "#EB5757",
          subtle: "#FDEAEA",
          ink: "#C0392B"
        },
        info: {
          DEFAULT: "#84A2F4",
          subtle: "#E0E7FF",
          ink: "#345CCC"
        }
      },
      borderRadius: {
        pill: "9999px",
        card: "12px",
        sheet: "16px",
        hero: "24px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(14, 14, 14, 0.04), 0 4px 12px rgba(14, 14, 14, 0.04)",
        sheet: "0 -8px 24px rgba(14, 14, 14, 0.08)",
        focus: "0 0 0 3px rgba(56, 106, 246, 0.18)"
      },
      maxWidth: {
        shell: "430px"
      }
    }
  },
  plugins: []
};

export default config;
