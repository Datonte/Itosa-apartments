// Apply dark/light class immediately — before Tailwind parses anything — to prevent flash.
(function () {
  const saved = localStorage.getItem("itosa.theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = saved === "dark" || (!saved && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.classList.toggle("light", !dark);
})();

// Single source of truth for the ITOSA design system.
// Loaded BEFORE the Tailwind CDN script so `tailwind.config` is read at boot.
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand
        "brand-yellow": "#f9bd22",
        "brand-yellow-soft": "#ffdf9f",
        "brand-yellow-deep": "#795900",
        "brand-ink": "#181919",
        "brand-bg": "#fdf8f8",
        "accent-blue": "#009ddf",
        "accent-green": "#3a8b6a",

        // Material 3 palette (kept for compatibility with existing markup)
        "primary": "#181919",
        "primary-container": "#2d2d2d",
        "primary-fixed": "#e4e2e1",
        "primary-fixed-dim": "#c8c6c6",
        "on-primary": "#ffffff",
        "on-primary-container": "#959494",
        "on-primary-fixed": "#1b1c1c",
        "on-primary-fixed-variant": "#474747",
        "inverse-primary": "#c8c6c6",

        "secondary": "#795900",
        "secondary-container": "#ffc329",
        "secondary-fixed": "#ffdf9f",
        "secondary-fixed-dim": "#f9bd22",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#6f5100",
        "on-secondary-fixed": "#261a00",
        "on-secondary-fixed-variant": "#5c4300",

        "tertiary": "#001a2a",
        "tertiary-container": "#003048",
        "tertiary-fixed": "#c9e6ff",
        "tertiary-fixed-dim": "#89ceff",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#009ddf",
        "on-tertiary-fixed": "#001e2f",
        "on-tertiary-fixed-variant": "#004c6e",

        "background": "#fdf8f8",
        "on-background": "#1c1b1b",
        "surface": "#fdf8f8",
        "surface-bright": "#fdf8f8",
        "surface-dim": "#ddd9d8",
        "surface-tint": "#5f5e5e",
        "surface-variant": "#e5e2e1",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f7f3f2",
        "surface-container": "#f1edec",
        "surface-container-high": "#ebe7e7",
        "surface-container-highest": "#e5e2e1",
        "on-surface": "#1c1b1b",
        "on-surface-variant": "#444748",
        "inverse-surface": "#313030",
        "inverse-on-surface": "#f4f0ef",

        "outline": "#747878",
        "outline-variant": "#c4c7c7",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px"
      },
      spacing: {
        "section-gap": "100px",
        "margin-mobile": "20px",
        "container-max": "1280px",
        "unit": "8px",
        "gutter": "32px"
      },
      maxWidth: {
        "container": "1280px",
        "prose-wide": "72ch"
      },
      fontFamily: {
        // Standardized: Manrope for display/headlines, Be Vietnam Pro for body/labels
        "display-xl": ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        "headline-lg": ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        "headline-md": ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        "body-lg": ["Be Vietnam Pro", "ui-sans-serif", "system-ui", "sans-serif"],
        "body-md": ["Be Vietnam Pro", "ui-sans-serif", "system-ui", "sans-serif"],
        "label-bold": ["Be Vietnam Pro", "ui-sans-serif", "system-ui", "sans-serif"],
        "caption": ["Be Vietnam Pro", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["clamp(1.25rem, 2vw, 1.625rem)", { lineHeight: "1.3", fontWeight: "700" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.65", fontWeight: "400" }],
        "label-bold": ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.06em", fontWeight: "600" }],
        "caption": ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }]
      },
      boxShadow: {
        "card": "0 8px 30px rgba(0,0,0,0.04)",
        "card-hover": "0 20px 40px rgba(0,0,0,0.08)",
        "lift": "0 4px 24px rgba(0,0,0,0.06)",
        "ring-yellow": "0 0 0 4px rgba(249,189,34,0.18)"
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(.22,.68,0,1.2)"
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } }
      }
    }
  }
};
