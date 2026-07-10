/**
 * BISMILLAH Design System Tokens
 * Defines the core visual primitives of the platform.
 * These are mapped to Tailwind v4 @theme inside globals.css.
 */

export const colors = {
  brand: {
    obsidian: "#030712",
    space: "#1e293b",
    champagne: "#d4af37",
  },
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
  },
  background: "var(--background)",
  foreground: "var(--foreground)",
};

export const typography = {
  fonts: {
    sans: "var(--font-sans)",
    display: "var(--font-display)",
    serif: "var(--font-serif)",
  },
  scale: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
};

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px",
  12: "48px",
  16: "64px",
  24: "96px",
};

export const radius = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  full: "9999px",
};

export const tokens = {
  colors,
  typography,
  spacing,
  radius,
};
