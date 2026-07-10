// Design Tokens representing BISMILLAH Wellness OS corporate design system.
// These are referenced by the brand guidelines rendering page and UI Kit.

export const DESIGN_TOKENS = {
  brand: {
    name: 'BISMILLAH',
    tagline: 'Centro de Bienestar Digital',
    philosophy: 'Purity, Science, and Digital-Wellness Innovation'
  },
  colors: {
    dark: {
      backgroundPrimary: '#030712', // Obsidian Navy Base
      backgroundSecondary: '#0b0f19', // Deep Card Navy
      backgroundTertiary: '#111827', // Accent Slate
      textPrimary: '#ffffff', // Pure White
      textSecondary: '#94a3b8', // Silver Muted
      textTertiary: '#64748b', // Slate Dark
      border: 'rgba(255, 255, 255, 0.08)',
      accentGold: '#d4af37', // Champagne Gold
      accentGoldGlow: 'rgba(212, 175, 55, 0.15)'
    },
    light: {
      backgroundPrimary: '#fafafa', // Pure Silver Light
      backgroundSecondary: '#ffffff', // Card White
      backgroundTertiary: '#f1f5f9', // Slate Light Accent
      textPrimary: '#0f172a', // Deep Obsidian Text
      textSecondary: '#475569', // Muted Gray
      textTertiary: '#94a3b8', // Light Slate Muted
      border: 'rgba(15, 23, 42, 0.08)',
      accentGold: '#b89225', // Darker gold for light mode contrast
      accentGoldGlow: 'rgba(184, 146, 37, 0.1)'
    },
    programs: {
      sleep: {
        primary: '#38bdf8', // Neon Sky Blue
        gradient: 'from-blue-600/20 via-sky-500/10 to-transparent',
        shadow: 'rgba(56, 189, 248, 0.15)'
      },
      joint: {
        primary: '#10b981', // Emerald Green
        gradient: 'from-emerald-600/20 via-teal-500/10 to-transparent',
        shadow: 'rgba(16, 185, 129, 0.15)'
      },
      heart: {
        primary: '#f43f5e', // Crimson Rose Red
        gradient: 'from-rose-600/20 via-pink-500/10 to-transparent',
        shadow: 'rgba(244, 63, 94, 0.15)'
      }
    }
  },
  spacing: {
    4: '4px (0.25rem)',
    8: '8px (0.5rem)',
    12: '12px (0.75rem)',
    16: '16px (1rem) - Base Padding',
    24: '24px (1.5rem) - Card Spacing',
    32: '32px (2rem)',
    48: '48px (3rem) - Section Spacing',
    64: '64px (4rem) - Large Section Gap',
    96: '96px (6rem) - Hero Block Gap'
  },
  radius: {
    xs: '4px - Badges',
    sm: '8px - Small Buttons',
    md: '12px - Inputs & Standard Buttons',
    lg: '16px - Standard Cards',
    xl: '24px - Hero Blocks & Modals',
    full: '9999px - Pills & Rounded Highlights'
  },
  elevation: {
    sm: '0 2px 8px -rgba(0,0,0,0.4)',
    md: '0 4px 16px -rgba(0,0,0,0.5) - Card level',
    lg: '0 8px 32px -rgba(0,0,0,0.6) - Dialog level',
    goldGlow: '0 0 25px rgba(212, 175, 55, 0.25)',
    blueGlow: '0 0 25px rgba(56, 189, 248, 0.25)',
    greenGlow: '0 0 25px rgba(16, 185, 129, 0.25)',
    roseGlow: '0 0 25px rgba(244, 63, 94, 0.25)'
  },
  typography: {
    fonts: {
      headings: 'Plus Jakarta Sans (Geometric Technical)',
      serif: 'Playfair Display (Luxury Editorial / Serif Fallback)',
      body: 'Inter (High Readability UI)'
    },
    scale: {
      xs: '12px (0.75rem)',
      sm: '14px (0.875rem)',
      base: '16px (1rem)',
      lg: '18px (1.125rem)',
      xl: '20px (1.25rem)',
      h3: '24px (1.5rem)',
      h2: '32px (2rem)',
      h1: '48px (3rem)',
      hero: '64px (4rem)'
    }
  },
  breakpoints: {
    sm: '640px - Mobile Landscape',
    md: '768px - Tablet Portrait',
    lg: '1024px - Laptop/Tablet Landscape',
    xl: '1280px - Standard Desktop',
    '2xl': '1536px - Ultra Wide Screen'
  },
  accessibility: {
    wcagRating: 'WCAG 2.1 AA Compliant',
    contrastRatioMin: '4.5:1 for normal text, 3:1 for large text',
    rules: [
      'Debe proveerse alternativas de texto para toda imagen no decorativa.',
      'Los elementos interactivos deben contar con etiquetas explícitas aria-label.',
      'El foco del teclado debe ser visible en todo momento con un borde dorado o azul contrastante.',
      'El tamaño mínimo del área táctil para clicks en móvil es de 44x44 píxeles.'
    ]
  }
};
