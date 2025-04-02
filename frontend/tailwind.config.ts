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
      "title-h1": [
        "56px",
        {
          lineHeight: "64px",
          letterSpacing: "-0.56px",
          fontWeight: 600,
        },
      ],
      "title-h2": [
        "48px",
        {
          lineHeight: "56px",
          letterSpacing: "-0.48px",
          fontWeight: 600,
        },
      ],
      "title-h3": [
        "40px",
        {
          lineHeight: "48px",
          letterSpacing: "-0.4px",
          fontWeight: 600,
        },
      ],
      "title-h4": [
        "32px",
        {
          lineHeight: "40px",
          fontWeight: 600,
        },
      ],
      "title-h5": [
        "24px",
        {
          lineHeight: "32px",
          fontWeight: 600,
        },
      ],
      "title-h6": [
        "20px",
        {
          lineHeight: "28px",
          fontWeight: 600,
        },
      ],
      "p-xl": [
        "24px",
        {
          lineHeight: "32px",
          letterSpacing: "-0.36px",
          fontWeight: 400,
        },
      ],
      "p-lg": [
        "18px",
        {
          lineHeight: "24px",
          letterSpacing: "-0.27px",
          fontWeight: 400,
        },
      ],
      "p-md": [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "-0.176px",
          fontWeight: 400,
        },
      ],
      "p-sm": [
        "14px",
        {
          lineHeight: "20px",
          letterSpacing: "-0.084px",
          fontWeight: 400,
        },
      ],
      "p-xs": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: 400,
        },
      ],
      "p-2xs": [
        "11px",
        {
          lineHeight: "16px",
          fontWeight: 400,
        },
      ],
      "label-xl-pri": [
        "24px",
        {
          lineHeight: "32px",
          letterSpacing: "-0.36px",
          fontWeight: 600,
        },
      ],
      "label-xl-sec": [
        "24px",
        {
          lineHeight: "32px",
          letterSpacing: "-0.36px",
          fontWeight: 500,
        },
      ],
      "label-lg-pri": [
        "18px",
        {
          lineHeight: "24px",
          letterSpacing: "-0.27px",
          fontWeight: 600,
        },
      ],
      "label-lg-sec": [
        "18px",
        {
          lineHeight: "24px",
          letterSpacing: "-0.27px",
          fontWeight: 500,
        },
      ],
      "label-md-pri": [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "-0.176px",
          fontWeight: 600,
        },
      ],
      "label-md-sec": [
        "16px",
        {
          lineHeight: "24px",
          letterSpacing: "-0.176px",
          fontWeight: 500,
        },
      ],
      "label-sm-pri": [
        "14px",
        {
          lineHeight: "20px",
          letterSpacing: "-0.084px",
          fontWeight: 600,
        },
      ],
      "label-sm-sec": [
        "14px",
        {
          lineHeight: "20px",
          letterSpacing: "-0.084px",
          fontWeight: 500,
        },
      ],
      "label-xs-pri": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: 600,
        },
      ],
      "label-xs-sec": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: 500,
        },
      ],
      "label-2xs-pri": [
        "11px",
        {
          lineHeight: "16px",
          fontWeight: 600,
        },
      ],
      "label-2xs-sec": [
        "11px",
        {
          lineHeight: "16px",
          fontWeight: 500,
        },
      ],
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
      "5xl-regular": [
        "48px",
        {
          lineHeight: "52px",
          fontWeight: 400,
        }
      ],
      "5xl-medium": [
        "48px",
        {
          lineHeight: "52px",
          fontWeight: 500,
        }
      ],
      "5xl-semibold": [
        "48px",
        {
          lineHeight: "52px",
          fontWeight: 600,
        } 
      ],
      "5xl-bold": [
        "48px",
        {
          lineHeight: "52px",
          fontWeight: 700,
        }
      ],
      "6xl-regular": [
        "64px",
        {
          lineHeight: "68px",
          fontWeight: 400,
        }
      ],
      "6xl-medium": [
        "64px",
        {
          lineHeight: "68px",
          fontWeight: 500,
        }
      ],
      "6xl-semibold": [
        "64px",
        {
          lineHeight: "68px",
          fontWeight: 600,
        }
      ],
      "6xl-bold": [
        "64px",
        {
          lineHeight: "68px",
          fontWeight: 700,
        }
      ],
      "7xl-regular": [
        "80px",
        {
          lineHeight: "84px",
          fontWeight: 400,
        }
      ],
      "7xl-medium": [
        "80px",
        {
          lineHeight: "84px",
          fontWeight: 500,
        }
      ],
      "7xl-semibold": [
        "80px",
        {
          lineHeight: "84px",
          fontWeight: 600,
        }
      ],
      "7xl-bold": [
        "80px",
        {
          lineHeight: "84px",
          fontWeight: 700,
        }
      ],
      "8xl-regular": [
        "96px",
        {
          lineHeight: "100px",
          fontWeight: 400,
        }
      ],
      "8xl-medium": [
        "96px",
        {
          lineHeight: "100px",
          fontWeight: 500,
        }
      ],
      "8xl-semibold": [
        "96px",
        {
          lineHeight: "100px",
          fontWeight: 600,
        }
      ],
      "8xl-bold": [
        "96px",
        {
          lineHeight: "100px",
          fontWeight: 700,
        }
      ],
      "9xl-regular": [
        "112px",
        {
          lineHeight: "116px",
          fontWeight: 400,
        }
      ],
      "9xl-medium": [
        "112px",
        {
          lineHeight: "116px",
          fontWeight: 500,
        }
      ],
      "9xl-semibold": [
        "112px",
        {
          lineHeight: "116px",
          fontWeight: 600,
        }
      ],
      "9xl-bold": [
        "112px",
        {
          lineHeight: "116px",
          fontWeight: 700,
        }
      ],
      
    },
    fontFamily: {
      inter: ["var(--font-inter)"],
      interDisplay: ["var(--font-inter-display)"],
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
        base: {
          pri: "var(--base-pri)",
          sec: "var(--base-sec)",
          empty: "var(--base-empty)",
          bg: "var(--base-bg)",
          tent: "var(--base-tent)",
          sc: "var(--base-sc)",
          wn: "var(--base-wn)",
          dg: "var(--base-dg)",
        },
        sf: {
          pri: {
            empty: "var(--sf-pri-empty)",
            df: "var(--sf-pri-df)",
            hv: "var(--sf-pri-hv)",
            pressed: "var(--sf-pri-pressed)",
            sub: "var(--sf-pri-sub)",
            dis: "var(--sf-pri-dis)",
          },
          hl: {
            df: "var(--sf-hl-df)",
            hv: "var(--sf-hl-hv)",
            pressed: "var(--sf-hl-pressed)",
          },
          sc: {
            df: "var(--sf-sc-df)",
            hv: "var(--sf-sc-hv)",
            pressed: "var(--sf-sc-pressed)",
            hl: "var(--sf-sc-hl)",
          },
          wn: {
            df: "var(--sf-wn-df)",
            hv: "var(--sf-wn-hv)",
            pressed: "var(--sf-wn-pressed)",
            hl: "var(--sf-wn-hl)",
          },
          dg: {
            df: "var(--sf-dg-df)",
            hv: "var(--sf-dg-hv)",
            pressed: "var(--sf-dg-pressed)",
            hl: "var(--sf-dg-hl)",
          },
        },
        itr: {
          tentPri: {
            df: "var(--itr-tentPri-df)",
            sub: "var(--itr-tentPri-sub)",
            dis: "var(--itr-tentPri-dis)",
          },
          tentSec: {
            df: "var(--itr-tentSec-df)",
            sub: "var(--itr-tentSec-sub)",
            dis: "var(--itr-tentSec-dis)",
          },
          dg: {
            df: "var(--itr-dg-df)",
            hv: "var(--itr-dg-hv)",
            pressed: "var(--itr-dg-pressed)",
            tentDf: "var(--itr-dg-tentDf)",
            tentSub: "var(--itr-dg-tentSub)",
          },
          tone: {
            pri: "var(--itr-tone-pri)",
            tent: "var(--itr-tone-tent)",
            tentSub: "var(--itr-tone-tentSub)",
            sub: "var(--itr-tone-sub)",
            hl: "var(--itr-tone-hl)",
            sc: "var(--itr-tone-sc)",
            scSub: "var(--itr-tone-scSub)",
            wn: "var(--itr-tone-wn)",
            wnSub: "var(--itr-tone-wnSub)",
            dg: "var(--itr-tone-dg)",
            dgSub: "var(--itr-tone-dgSub)",
          },
        },
        bd: {
          pri: {
            ter: "var(--bd-pri-ter)",
            df: "var(--bd-pri-df)",
            hv: "var(--bd-pri-hv)",
            pressed: "var(--bd-pri-pressed)",
            dis: "var(--bd-pri-dis)",
            sub: "var(--bd-pri-sub)",
          },
          sec: { df: "var(--bd-sec-df)", sub: "var(--bd-sec-sub)" },
          hl: { df: "var(--bd-hl-df)", sub: "var(--bd-hl-sub)" },
          sc: { df: "var(--bd-sc-df)", sub: "var(--bd-sc-sub)" },
          wn: { df: "var(--bd-wn-df)", sub: "var(--bd-wn-sub)" },
          dg: { df: "var(--bd-dg-df)", sub: "var(--bd-dg-sub)" },
          dark: { df: "var(--bd-dark-df)", sub: "var(--bd-dark-sub)" },
        },
        dec: {
          brand: {
            df: "var(--dec-brand-df)",
            sub: "var(--dec-brand-sub)",
          },
          leaf: {
            df: "var(--dec-leaf-df)",
            sub: "var(--dec-leaf-sub)",
          },
          cream: {
            df: "var(--dec-cream-df)",
            sub: "var(--dec-cream-sub)",
          },
          yellow: {
            df: "var(--dec-yellow-df)",
            sub: "var(--dec-yellow-sub)",
          },
          rose: {
            df: "var(--dec-rose-df)",
            sub: "var(--dec-rose-sub)",
          },
        },
        brand: {
          strong: "var(--brand-strong)",
          deep: "var(--brand-deep)",
          fun: "var(--brand-fun)",
          cool: "var(--brand-cool)",
          river: "var(--brand-river)",
          snow: "var(--brand-snow)",
          white: "var(--brand-white)",
        },
        ovl: {
          lg: "var(--ovl-lg)",
          md: "var(--ovl-md)",
          sm: "var(--ovl-sm)",
          ctn: "var(--ovl-ctn)",
        },
        cpn: { tent: "var(--cpn-tent)", bg: "var(--cpn-bg)", tooltip: "var(--cpn-tooltip)" },
        pn: {
          ah: "var(--pn-ah)",
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
