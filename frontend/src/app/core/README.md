# Color System - Clean Architecture Implementation

This directory contains a comprehensive color management system following clean architecture principles for the Angular application.

## Architecture Overview

The color system is organized into distinct layers following clean architecture:

```
src/app/core/
├── constants/
│   └── colors.ts          # Color definitions and constants
├── services/
│   └── color.service.ts   # Color management service
├── utils/
│   └── color.utils.ts     # Color utility functions
├── styles/
│   └── colors.css         # CSS variables and utility classes
└── index.ts               # Main export file
```

## Features

### 🎨 Comprehensive Color Palette
- **Primary Colors**: Brand primary colors with light/dark variants
- **Secondary Colors**: Supporting brand colors
- **Accent Colors**: Highlight and call-to-action colors
- **Semantic Colors**: Success, error, warning, info states
- **Neutral Colors**: Grayscale palette for text and backgrounds
- **Status Colors**: Online, offline, busy, away states

### 🌓 Theme Support
- Light and dark theme support
- System theme preference detection
- Dynamic theme switching
- CSS custom properties for theming

### ♿ Accessibility Features
- WCAG AA/AAA contrast ratio validation
- High contrast mode support
- Reduced motion support
- Color blindness considerations

### 🔧 Utility Functions
- Color conversion (HEX ↔ RGB ↔ HSL)
- Color manipulation (lighten, darken, saturate)
- Color palette generation
- Contrast calculations

## Usage Examples

### 1. Using Color Constants

```typescript
import { PRIMARY_COLORS, SEMANTIC_COLORS } from '@/app/core';

// Direct usage
const primaryColor = PRIMARY_COLORS.primary; // '#3B82F6'
const successColor = SEMANTIC_COLORS.success; // '#10B981'
```

### 2. Using Color Service

```typescript
import { ColorService } from '@/app/core';

@Component({...})
export class MyComponent {
  constructor(private colorService: ColorService) {}

  // Get colors
  getPrimaryColor() {
    return this.colorService.getColor('primary');
  }

  // Theme management
  toggleTheme() {
    this.colorService.toggleTheme();
  }

  // Subscribe to theme changes
  ngOnInit() {
    this.colorService.onThemeChange().subscribe(theme => {
      console.log('Theme changed to:', theme);
    });
  }
}
```

### 3. Using Color Utilities

```typescript
import { 
  lighten, 
  darken, 
  getContrastColor, 
  generateColorPalette 
} from '@/app/core';

// Color manipulation
const lighterBlue = lighten('#3B82F6', 20);
const darkerBlue = darken('#3B82F6', 20);

// Contrast calculation
const textColor = getContrastColor('#3B82F6');

// Generate palette
const palette = generateColorPalette('#3B82F6');
```

### 4. Using CSS Classes

```html
<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-secondary-light">Light secondary background</div>
<div class="bg-success">Success background</div>

<!-- Text colors -->
<p class="text-primary">Primary text</p>
<p class="text-secondary-text">Secondary text</p>
<p class="text-error">Error text</p>

<!-- Border colors -->
<div class="border border-primary">Primary border</div>
<div class="border border-focus">Focus border</div>

<!-- Hover states -->
<button class="bg-primary hover:bg-primary-hover">Hover button</button>

<!-- Status indicators -->
<span class="status-online">● Online</span>
<span class="status-offline">● Offline</span>
```

### 5. Using CSS Variables

```css
.my-component {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}

.my-component:hover {
  background-color: var(--color-primary-hover);
}
```

## Color Categories

### Primary Colors
- `primary`: Main brand color (#3B82F6)
- `primaryLight`: Light variant (#60A5FA)
- `primaryDark`: Dark variant (#1D4ED8)
- `primaryHover`: Hover state (#2563EB)

### Secondary Colors
- `secondary`: Supporting brand color (#10B981)
- `secondaryLight`: Light variant (#34D399)
- `secondaryDark`: Dark variant (#059669)
- `secondaryHover`: Hover state (#059669)

### Semantic Colors
- `success`: Success states (#10B981)
- `error`: Error states (#EF4444)
- `warning`: Warning states (#F59E0B)
- `info`: Information states (#3B82F6)

### Neutral Colors
- `white`: Pure white (#FFFFFF)
- `black`: Pure black (#000000)
- `gray50` through `gray900`: Grayscale palette

## Theme System

### Light Theme (Default)
- Background: White (#FFFFFF)
- Text: Dark gray (#111827)
- Borders: Light gray (#E5E7EB)

### Dark Theme
- Background: Dark gray (#111827)
- Text: Light gray (#F9FAFB)
- Borders: Medium gray (#374151)

### Theme Switching
```typescript
// Switch to dark theme
this.colorService.setTheme('dark');

// Toggle between themes
this.colorService.toggleTheme();

// Get current theme
const currentTheme = this.colorService.getCurrentTheme();
```

## Accessibility Features

### Contrast Ratios
All color combinations meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  :root {
    --color-primary: #0000FF;
    --color-secondary: #008000;
    --color-error: #FF0000;
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Best Practices

### 1. Use Semantic Colors
```typescript
// ✅ Good - Use semantic colors
const successColor = SEMANTIC_COLORS.success;
const errorColor = SEMANTIC_COLORS.error;

// ❌ Bad - Use hardcoded colors
const successColor = '#10B981';
const errorColor = '#EF4444';
```

### 2. Use CSS Variables
```css
/* ✅ Good - Use CSS variables */
.my-component {
  color: var(--color-text-primary);
}

/* ❌ Bad - Use hardcoded colors */
.my-component {
  color: #111827;
}
```

### 3. Use Utility Classes
```html
<!-- ✅ Good - Use utility classes -->
<div class="bg-primary text-white">Primary button</div>

<!-- ❌ Bad - Use inline styles -->
<div style="background-color: #3B82F6; color: white;">Primary button</div>
```

### 4. Check Contrast Ratios
```typescript
import { meetsWCAGAA } from '@/app/core';

const hasGoodContrast = meetsWCAGAA('#3B82F6', '#FFFFFF');
```

## Testing

### Color Validation
```typescript
import { isValidHexColor } from '@/app/core';

const isValid = isValidHexColor('#3B82F6'); // true
const isInvalid = isValidHexColor('invalid'); // false
```

### Contrast Testing
```typescript
import { getContrastRatio, meetsWCAGAA } from '@/app/core';

const ratio = getContrastRatio('#3B82F6', '#FFFFFF');
const meetsStandard = meetsWCAGAA('#3B82F6', '#FFFFFF');
```

## Migration Guide

### From Hardcoded Colors
```typescript
// Before
const color = '#3B82F6';

// After
import { PRIMARY_COLORS } from '@/app/core';
const color = PRIMARY_COLORS.primary;
```

### From Inline Styles
```html
<!-- Before -->
<div style="background-color: #3B82F6; color: white;">

<!-- After -->
<div class="bg-primary text-white">
```

## Contributing

When adding new colors:

1. Add to the appropriate constant in `colors.ts`
2. Add CSS variables in `colors.css`
3. Add utility classes in `colors.css`
4. Update this documentation
5. Test contrast ratios
6. Test in both light and dark themes

## Dependencies

- Angular (for service injection)
- RxJS (for theme observables)
- No external color libraries required

## Browser Support

- Modern browsers with CSS custom properties support
- Graceful degradation for older browsers
- High contrast mode support
- Reduced motion support 