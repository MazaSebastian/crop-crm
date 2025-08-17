export const theme = {
  colors: {
    primary: '#10b981',
    primaryDark: '#059669',
    bg: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    mutedText: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px'
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 10px rgba(0,0,0,0.08)'
  },
  spacing: (n: number) => `${n * 4}px`
} as const;

export type AppTheme = typeof theme;

