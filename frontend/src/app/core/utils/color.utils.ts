import { 
  PRIMARY_COLORS, 
  SECONDARY_COLORS, 
  ACCENT_COLORS, 
  NEUTRAL_COLORS, 
  SEMANTIC_COLORS,
  TEXT_COLORS
} from '../constants/colors';

/**
 * Color Utilities - Clean Architecture Implementation
 * 
 * This file contains utility functions for:
 * - Color conversion and manipulation
 * - Color validation and formatting
 * - Accessibility color calculations
 * - Color palette generation
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert hex color to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
}

/**
 * Calculate color brightness
 */
export function getBrightness(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Check if color is light
 */
export function isLightColor(color: string): boolean {
  return getBrightness(color) > 128;
}

/**
 * Check if color is dark
 */
export function isDarkColor(color: string): boolean {
  return getBrightness(color) <= 128;
}

/**
 * Get contrasting text color
 */
export function getContrastColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? TEXT_COLORS.primary : TEXT_COLORS.inverse;
}

/**
 * Calculate color contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function meetsWCAGAA(color1: string, color2: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(color1, color2);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if color combination meets WCAG AAA standards
 */
export function meetsWCAGAAA(color1: string, color2: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(color1, color2);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Generate color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Lighten a color by percentage
 */
export function lighten(color: string, percentage: number): string {
  const hsl = hexToHsl(color);
  if (!hsl) return color;
  
  const newLightness = Math.min(100, hsl.l + percentage);
  return hslToHex(hsl.h, hsl.s, newLightness);
}

/**
 * Darken a color by percentage
 */
export function darken(color: string, percentage: number): string {
  const hsl = hexToHsl(color);
  if (!hsl) return color;
  
  const newLightness = Math.max(0, hsl.l - percentage);
  return hslToHex(hsl.h, hsl.s, newLightness);
}

/**
 * Saturate a color by percentage
 */
export function saturate(color: string, percentage: number): string {
  const hsl = hexToHsl(color);
  if (!hsl) return color;
  
  const newSaturation = Math.min(100, hsl.s + percentage);
  return hslToHex(hsl.h, newSaturation, hsl.l);
}

/**
 * Desaturate a color by percentage
 */
export function desaturate(color: string, percentage: number): string {
  const hsl = hexToHsl(color);
  if (!hsl) return color;
  
  const newSaturation = Math.max(0, hsl.s - percentage);
  return hslToHex(hsl.h, newSaturation, hsl.l);
}

/**
 * Adjust hue of a color
 */
export function adjustHue(color: string, degrees: number): string {
  const hsl = hexToHsl(color);
  if (!hsl) return color;
  
  const newHue = (hsl.h + degrees) % 360;
  return hslToHex(newHue < 0 ? newHue + 360 : newHue, hsl.s, hsl.l);
}

/**
 * Generate complementary color
 */
export function getComplementary(color: string): string {
  return adjustHue(color, 180);
}

/**
 * Generate analogous colors
 */
export function getAnalogous(color: string, count: number = 3): string[] {
  const hsl = hexToHsl(color);
  if (!hsl) return [color];
  
  const colors: string[] = [];
  const step = 30;
  const start = hsl.h - (step * Math.floor(count / 2));
  
  for (let i = 0; i < count; i++) {
    const hue = (start + (step * i)) % 360;
    colors.push(hslToHex(hue < 0 ? hue + 360 : hue, hsl.s, hsl.l));
  }
  
  return colors;
}

/**
 * Generate triadic colors
 */
export function getTriadic(color: string): string[] {
  const hsl = hexToHsl(color);
  if (!hsl) return [color];
  
  return [
    color,
    adjustHue(color, 120),
    adjustHue(color, 240)
  ];
}

/**
 * Generate tetradic colors
 */
export function getTetradic(color: string): string[] {
  const hsl = hexToHsl(color);
  if (!hsl) return [color];
  
  return [
    color,
    adjustHue(color, 90),
    adjustHue(color, 180),
    adjustHue(color, 270)
  ];
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Normalize hex color (ensure 6 digits)
 */
export function normalizeHexColor(color: string): string {
  if (!isValidHexColor(color)) return color;
  
  if (color.length === 4) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  
  return color;
}

/**
 * Generate color palette from base color
 */
export function generateColorPalette(baseColor: string): {
  light: string[];
  main: string;
  dark: string[];
} {
  const main = normalizeHexColor(baseColor);
  const light = [
    lighten(main, 20),
    lighten(main, 40),
    lighten(main, 60),
    lighten(main, 80)
  ];
  const dark = [
    darken(main, 20),
    darken(main, 40),
    darken(main, 60),
    darken(main, 80)
  ];
  
  return { light, main, dark };
}

/**
 * Get all predefined colors
 */
export function getAllPredefinedColors() {
  return {
    primary: PRIMARY_COLORS,
    secondary: SECONDARY_COLORS,
    accent: ACCENT_COLORS,
    neutral: NEUTRAL_COLORS,
    semantic: SEMANTIC_COLORS
  };
} 