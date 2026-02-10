// ========================================================================
// THEME CONFIGURATION
// ========================================================================
// Universal MUI theme factory for RationalBloks apps.
//
// Provides the standard RationalBloks look & feel (warm beige background,
// professional blue palette, polished typography) while allowing per-app
// customization through options.
//
// This lives in the package so theme improvements (new component overrides,
// better defaults) propagate to all apps via npm update.
//
// Usage:
//   import { createAppTheme } from '@rationalbloks/frontblok-components';
//   const theme = createAppTheme(); // standard theme
//   const theme = createAppTheme({ paletteOverrides: { primary: { main: '#e91e63' } } });
// ========================================================================

import { createTheme, type ThemeOptions } from '@mui/material/styles';

// ========================================================================
// DEFAULT COLOR PALETTE
// ========================================================================

export const defaultPalette = {
  primary: {
    main: '#1e40af',
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  secondary: {
    main: '#6b7280',
  },
  success: {
    main: '#10b981',
  },
  warning: {
    main: '#f59e0b',
  },
  error: {
    main: '#ef4444',
  },
  background: {
    default: 'hsl(33.3, 60%, 97.1%)', // Beautiful warm beige
    paper: '#FCFAF7', // Warm white for cards
  },
};

// ========================================================================
// DEFAULT TYPOGRAPHY
// ========================================================================

export const defaultTypography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", "Helvetica Neue", sans-serif',
  h1: {
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  h2: {
    fontWeight: 700,
    letterSpacing: '-0.4px',
  },
  h3: {
    fontWeight: 600,
    letterSpacing: '-0.3px',
  },
  h4: {
    fontWeight: 700,
    letterSpacing: '-0.2px',
  },
  h5: {
    fontWeight: 600,
    letterSpacing: '-0.1px',
  },
  h6: {
    fontWeight: 600,
    letterSpacing: '-0.08px',
  },
};

// ========================================================================
// DEFAULT COMPONENT OVERRIDES
// ========================================================================

export const defaultComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        fontWeight: 600,
        borderRadius: '8px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", "Helvetica Neue", sans-serif',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-input': {
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", "Helvetica Neue", sans-serif',
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", "Helvetica Neue", sans-serif',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", "Helvetica Neue", sans-serif',
      },
    },
  },
};

// ========================================================================
// DEFAULT NAVBAR GRADIENT
// ========================================================================

export const defaultNavbarGradient = {
  start: '#1800ad',
  end: '#0d0067',
};

// ========================================================================
// THEME FACTORY FUNCTION
// ========================================================================

export interface AppThemeOptions {
  // Override default palette colors
  paletteOverrides?: Record<string, unknown>;
  // Override default typography settings
  typographyOverrides?: Record<string, unknown>;
  // Override default component styles
  componentsOverrides?: ThemeOptions['components'];
  // Border radius for shapes. Default: 12
  borderRadius?: number;
}

// Creates a MUI theme with RationalBloks defaults.
//
// All defaults can be overridden per-app via the options parameter.
// The defaults include:
// - Warm beige background
// - Professional blue primary palette
// - System font typography with tight letter-spacing
// - Polished component overrides (no uppercase buttons, rounded cards, etc.)
//
// Example:
//   // Use defaults
//   const theme = createAppTheme();
//
//   // Override primary color
//   const theme = createAppTheme({
//     paletteOverrides: { primary: { main: '#e91e63' } },
//   });
export function createAppTheme(options: AppThemeOptions = {}) {
  const {
    paletteOverrides = {},
    typographyOverrides = {},
    componentsOverrides = {},
    borderRadius = 12,
  } = options;

  return createTheme({
    palette: {
      ...defaultPalette,
      ...paletteOverrides,
    } as ThemeOptions['palette'],
    typography: {
      ...defaultTypography,
      ...typographyOverrides,
    },
    shape: {
      borderRadius,
    },
    components: {
      ...defaultComponents,
      ...componentsOverrides,
    },
  });
}
