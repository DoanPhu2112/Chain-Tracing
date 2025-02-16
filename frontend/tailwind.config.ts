import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      "xs-regular": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: 400,
        },
      ],
      "xs-medium": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: 500,
        },
      ],
      "xs-semibold": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: 600,
        },
      ],
      "xs-bold": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: 700,
        },
      ],
      "sm-regular": [
        "14px",
        {
          lineHeight: "20px",
          fontWeight: 400,
        },
      ],
      "sm-medium": [
        "14px",
        {
          lineHeight: "20px",
          fontWeight: 500,
        },
      ],
      "sm-semibold": [
        "14px",
        {
          lineHeight: "20px",
          fontWeight: 600,
        },
      ],
      "sm-bold": [
        "14px",
        {
          lineHeight: "20px",
          fontWeight: 700,
        },
      ],
      "base-regular": [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: 400,
        },
      ],
      "base-medium": [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: 500,
        },
      ],
      "base-semibold": [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: 600,
        },
      ],
      "base-bold": [
        "16px",
        {
          lineHeight: "24px",
          fontWeight: 700,
        },
      ],
      "lg-regular": [
        "18px",
        {
          lineHeight: "28px",
          fontWeight: 400,
        },
      ],
      "lg-medium": [
        "18px",
        {
          lineHeight: "28px",
          fontWeight: 500,
        },
      ],
      "lg-semibold": [
        "18px",
        {
          lineHeight: "28px",
          fontWeight: 600,
        },
      ],
      "lg-bold": [
        "18px",
        {
          lineHeight: "28px",
          fontWeight: 700,
        },
      ],
      "xl-regular": [
        "20px",
        {
          lineHeight: "28px",
          fontWeight: 400,
        },
      ],
      "xl-medium": [
        "20px",
        {
          lineHeight: "28px",
          fontWeight: 500,
        },
      ],
      "xl-semibold": [
        "20px",
        {
          lineHeight: "28px",
          fontWeight: 600,
        },
      ],
      "xl-bold": [
        "20px",
        {
          lineHeight: "28px",
          fontWeight: 700,
        },
      ],
      "2xl-regular": [
        "24px",
        {
          lineHeight: "32px",
          fontWeight: 400,
        },
      ],
      "2xl-medium": [
        "24px",
        {
          lineHeight: "32px",
          fontWeight: 500,
        },
      ],
      "2xl-semibold": [
        "24px",
        {
          lineHeight: "32px",
          fontWeight: 600,
        },
      ],
      "2xl-bold": [
        "24px",
        {
          lineHeight: "32px",
          fontWeight: 700,
        },
      ],
      "3xl-regular": [
        "30px",
        {
          lineHeight: "36px",
          fontWeight: 400,
        },
      ],
      "3xl-medium": [
        "30px",
        {
          lineHeight: "36px",
          fontWeight: 500,
        },
      ],
      "3xl-semibold": [
        "30px",
        {
          lineHeight: "36px",
          fontWeight: 600,
        },
      ],
      "3xl-bold": [
        "30px",
        {
          lineHeight: "36px",
          fontWeight: 700,
        },
      ],
      "4xl-regular": [
        "36px",
        {
          lineHeight: "40px",
          fontWeight: 400,
        },
      ],
      "4xl-medium": [
        "36px",
        {
          lineHeight: "40px",
          fontWeight: 500,
        },
      ],
      "4xl-semibold": [
        "36px",
        {
          lineHeight: "40px",
          fontWeight: 600,
        },
      ],
      "4xl-bold": [
        "36px",
        {
          lineHeight: "40px",
          fontWeight: 700,
        },
      ],
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
