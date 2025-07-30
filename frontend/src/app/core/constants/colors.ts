/**
 * Color Constants - Clean Architecture Implementation
 * 
 * This file contains all color definitions following clean architecture principles:
 * - Semantic naming for better maintainability
 * - Organized by color categories
 * - Type-safe color definitions
 * - Centralized color management
 */

// Primary Brand Colors
export const PRIMARY_COLORS = {
  primary: '#3B82F6',      // Blue
  primaryLight: '#60A5FA', // Light blue
  primaryDark: '#1D4ED8',  // Dark blue
  primaryHover: '#2563EB', // Hover state
} as const;

// Secondary Brand Colors
export const SECONDARY_COLORS = {
  secondary: '#10B981',     // Green
  secondaryLight: '#34D399', // Light green
  secondaryDark: '#059669',  // Dark green
  secondaryHover: '#059669', // Hover state
} as const;

// Accent Colors
export const ACCENT_COLORS = {
  accent: '#F59E0B',        // Orange
  accentLight: '#FBBF24',   // Light orange
  accentDark: '#D97706',    // Dark orange
  accentHover: '#F59E0B',   // Hover state
} as const;

// Neutral Colors
export const NEUTRAL_COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

// Semantic Colors
export const SEMANTIC_COLORS = {
  // Success Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#059669',
  
  // Error Colors
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#DC2626',
  
  // Warning Colors
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#D97706',
  
  // Info Colors
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoDark: '#1D4ED8',
} as const;

// Background Colors
export const BACKGROUND_COLORS = {
  primary: '#FFFFFF',
  secondary: '#F9FAFB',
  tertiary: '#F3F4F6',
  dark: '#1F2937',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

// Text Colors
export const TEXT_COLORS = {
  primary: '#111827',
  secondary: '#6B7280',
  tertiary: '#9CA3AF',
  inverse: '#FFFFFF',
  disabled: '#D1D5DB',
  link: '#3B82F6',
  linkHover: '#2563EB',
} as const;

// Border Colors
export const BORDER_COLORS = {
  primary: '#E5E7EB',
  secondary: '#D1D5DB',
  focus: '#3B82F6',
  error: '#EF4444',
  success: '#10B981',
} as const;

// Shadow Colors
export const SHADOW_COLORS = {
  light: 'rgba(0, 0, 0, 0.1)',
  medium: 'rgba(0, 0, 0, 0.15)',
  dark: 'rgba(0, 0, 0, 0.25)',
  colored: 'rgba(59, 130, 246, 0.25)',
} as const;

// Status Colors
export const STATUS_COLORS = {
  online: '#10B981',
  offline: '#6B7280',
  busy: '#EF4444',
  away: '#F59E0B',
} as const;

// Theme Colors (for dark/light mode support)
export const THEME_COLORS = {
  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#374151',
  },
} as const;

// Color Utility Types
export type ColorKey = keyof typeof PRIMARY_COLORS | 
                      keyof typeof SECONDARY_COLORS | 
                      keyof typeof ACCENT_COLORS | 
                      keyof typeof NEUTRAL_COLORS |
                      keyof typeof SEMANTIC_COLORS;

export type ThemeMode = 'light' | 'dark';

// Color Helper Functions
export const getColor = (colorKey: ColorKey): string => {
  const allColors = {
    ...PRIMARY_COLORS,
    ...SECONDARY_COLORS,
    ...ACCENT_COLORS,
    ...NEUTRAL_COLORS,
    ...SEMANTIC_COLORS,
  };
  
  return allColors[colorKey] || NEUTRAL_COLORS.gray500;
};

export const getThemeColor = (mode: ThemeMode, colorKey: keyof typeof THEME_COLORS.light): string => {
  return THEME_COLORS[mode][colorKey];
};

// CSS Custom Properties for dynamic theming
export const CSS_COLOR_VARIABLES = `
  :root {
    /* Primary Colors */
    --color-primary: ${PRIMARY_COLORS.primary};
    --color-primary-light: ${PRIMARY_COLORS.primaryLight};
    --color-primary-dark: ${PRIMARY_COLORS.primaryDark};
    --color-primary-hover: ${PRIMARY_COLORS.primaryHover};
    
    /* Secondary Colors */
    --color-secondary: ${SECONDARY_COLORS.secondary};
    --color-secondary-light: ${SECONDARY_COLORS.secondaryLight};
    --color-secondary-dark: ${SECONDARY_COLORS.secondaryDark};
    --color-secondary-hover: ${SECONDARY_COLORS.secondaryHover};
    
    /* Accent Colors */
    --color-accent: ${ACCENT_COLORS.accent};
    --color-accent-light: ${ACCENT_COLORS.accentLight};
    --color-accent-dark: ${ACCENT_COLORS.accentDark};
    --color-accent-hover: ${ACCENT_COLORS.accentHover};
    
    /* Semantic Colors */
    --color-success: ${SEMANTIC_COLORS.success};
    --color-error: ${SEMANTIC_COLORS.error};
    --color-warning: ${SEMANTIC_COLORS.warning};
    --color-info: ${SEMANTIC_COLORS.info};
    
    /* Background Colors */
    --color-background: ${BACKGROUND_COLORS.primary};
    --color-background-secondary: ${BACKGROUND_COLORS.secondary};
    --color-background-tertiary: ${BACKGROUND_COLORS.tertiary};
    
    /* Text Colors */
    --color-text-primary: ${TEXT_COLORS.primary};
    --color-text-secondary: ${TEXT_COLORS.secondary};
    --color-text-tertiary: ${TEXT_COLORS.tertiary};
    
    /* Border Colors */
    --color-border-primary: ${BORDER_COLORS.primary};
    --color-border-secondary: ${BORDER_COLORS.secondary};
    --color-border-focus: ${BORDER_COLORS.focus};
  }
  
  [data-theme="dark"] {
    --color-background: ${THEME_COLORS.dark.background};
    --color-background-secondary: ${THEME_COLORS.dark.surface};
    --color-text-primary: ${THEME_COLORS.dark.text};
    --color-text-secondary: ${THEME_COLORS.dark.textSecondary};
    --color-border-primary: ${THEME_COLORS.dark.border};
  }
`;

// Export all colors as a single object for easy access
export const COLORS = {
  primary: PRIMARY_COLORS,
  secondary: SECONDARY_COLORS,
  accent: ACCENT_COLORS,
  neutral: NEUTRAL_COLORS,
  semantic: SEMANTIC_COLORS,
  background: BACKGROUND_COLORS,
  text: TEXT_COLORS,
  border: BORDER_COLORS,
  shadow: SHADOW_COLORS,
  status: STATUS_COLORS,
  theme: THEME_COLORS,
} as const; 