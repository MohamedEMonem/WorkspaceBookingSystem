import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  COLORS, 
  PRIMARY_COLORS, 
  SECONDARY_COLORS, 
  ACCENT_COLORS, 
  NEUTRAL_COLORS, 
  SEMANTIC_COLORS,
  BACKGROUND_COLORS,
  TEXT_COLORS,
  BORDER_COLORS,
  SHADOW_COLORS,
  STATUS_COLORS,
  THEME_COLORS,
  ThemeMode,
  getColor,
  getThemeColor,
  CSS_COLOR_VARIABLES
} from '../constants/colors';

/**
 * Color Service - Clean Architecture Implementation
 * 
 * This service provides:
 * - Color management and retrieval
 * - Theme switching functionality
 * - Color utility functions
 * - Dynamic color generation
 * - Accessibility color validation
 */
@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private currentTheme = new BehaviorSubject<ThemeMode>('light');
  public currentTheme$ = this.currentTheme.asObservable();

  constructor() {
    this.initializeTheme();
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const systemTheme = this.getSystemTheme();
    const theme = savedTheme || systemTheme;
    this.setTheme(theme);
  }

  /**
   * Get system theme preference
   */
  private getSystemTheme(): ThemeMode {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  /**
   * Set current theme
   */
  public setTheme(theme: ThemeMode): void {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);
    this.applyThemeToDOM(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  public toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Apply theme to DOM
   */
  private applyThemeToDOM(theme: ThemeMode): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  /**
   * Get color by key
   */
  public getColor(colorKey: keyof typeof COLORS.primary | keyof typeof COLORS.secondary | keyof typeof COLORS.accent | keyof typeof COLORS.neutral | keyof typeof COLORS.semantic): string {
    return getColor(colorKey);
  }

  /**
   * Get theme color
   */
  public getThemeColor(colorKey: keyof typeof THEME_COLORS.light): string {
    return getThemeColor(this.currentTheme.value, colorKey);
  }

  /**
   * Get all colors
   */
  public getAllColors() {
    return COLORS;
  }

  /**
   * Get primary colors
   */
  public getPrimaryColors() {
    return PRIMARY_COLORS;
  }

  /**
   * Get secondary colors
   */
  public getSecondaryColors() {
    return SECONDARY_COLORS;
  }

  /**
   * Get accent colors
   */
  public getAccentColors() {
    return ACCENT_COLORS;
  }

  /**
   * Get neutral colors
   */
  public getNeutralColors() {
    return NEUTRAL_COLORS;
  }

  /**
   * Get semantic colors
   */
  public getSemanticColors() {
    return SEMANTIC_COLORS;
  }

  /**
   * Get background colors
   */
  public getBackgroundColors() {
    return BACKGROUND_COLORS;
  }

  /**
   * Get text colors
   */
  public getTextColors() {
    return TEXT_COLORS;
  }

  /**
   * Get border colors
   */
  public getBorderColors() {
    return BORDER_COLORS;
  }

  /**
   * Get shadow colors
   */
  public getShadowColors() {
    return SHADOW_COLORS;
  }

  /**
   * Get status colors
   */
  public getStatusColors() {
    return STATUS_COLORS;
  }

  /**
   * Generate color with opacity
   */
  public withOpacity(color: string, opacity: number): string {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  }

  /**
   * Generate lighter version of a color
   */
  public lighten(color: string, amount: number): string {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
      const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
      const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return color;
  }

  /**
   * Generate darker version of a color
   */
  public darken(color: string, amount: number): string {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
      const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
      const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return color;
  }

  /**
   * Check if color is light or dark
   */
  public isLightColor(color: string): boolean {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    }
    return true;
  }

  /**
   * Get contrasting text color for a background
   */
  public getContrastColor(backgroundColor: string): string {
    return this.isLightColor(backgroundColor) ? TEXT_COLORS.primary : TEXT_COLORS.inverse;
  }

  /**
   * Validate color format
   */
  public isValidColor(color: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-9.]+\s*\)$/;
    
    return hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color);
  }

  /**
   * Get CSS color variables
   */
  public getCSSColorVariables(): string {
    return CSS_COLOR_VARIABLES;
  }

  /**
   * Get current theme
   */
  public getCurrentTheme(): ThemeMode {
    return this.currentTheme.value;
  }

  /**
   * Subscribe to theme changes
   */
  public onThemeChange(): Observable<ThemeMode> {
    return this.currentTheme$;
  }
} 