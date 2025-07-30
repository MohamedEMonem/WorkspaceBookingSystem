/**
 * Core Module Index - Clean Architecture Implementation
 * 
 * This file exports all core functionality including:
 * - Color constants and utilities
 * - Color service
 * - Core utilities and helpers
 */

// Color Constants
export * from './constants/colors';

// Color Service
export * from './services/color.service';

// Color Utilities
export * from './utils/color.utils';

// Re-export commonly used types
export type { ColorKey, ThemeMode } from './constants/colors'; 