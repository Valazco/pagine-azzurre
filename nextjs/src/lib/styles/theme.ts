// Design System Theme - Pagine Azzurre
// Inspired by flowpack.ai modern minimalist design

export const theme = {
  colors: {
    // Primary
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#3b82f6',
    primaryLighter: '#dbeafe',

    // Secondary
    secondary: '#6b7280',
    secondaryHover: '#4b5563',

    // Status
    success: '#10b981',
    successLight: '#d1fae5',
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    info: '#3b82f6',
    infoLight: '#dbeafe',

    // Backgrounds
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTertiary: '#f3f4f6',
    backgroundDark: '#111827',

    // Text
    text: '#111827',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    textLight: '#ffffff',

    // Borders
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    borderDark: '#d1d5db',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  borderRadius: {
    none: '0',
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  typography: {
    fontFamily: {
      sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Consolas', monospace",
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },

  // Accessibility tokens
  a11y: {
    // Minimum touch target size (44x44px per WCAG)
    minTouchTarget: '44px',
    // Focus ring styles
    focusRingWidth: '2px',
    focusRingOffset: '2px',
    focusRingColor: '#2563eb',
    // Reduced motion query
    reducedMotion: '@media (prefers-reduced-motion: reduce)',
    // High contrast query
    highContrast: '@media (prefers-contrast: more)',
  },
} as const;

// Type exports for TypeScript support
export type Theme = typeof theme;
export type ThemeColors = keyof typeof theme.colors;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeBorderRadius = keyof typeof theme.borderRadius;
export type ThemeShadows = keyof typeof theme.shadows;

export default theme;
