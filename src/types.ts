// ============================================================================
// FRONTBLOK COMPONENTS - TYPES
// ============================================================================
// Props-based API for maximum flexibility and explicitness.
// ============================================================================

import { ReactNode } from 'react';

// Branding configuration passed to components.
// Customize the look and feel of auth components.
export interface Branding {
  // App name displayed in headers
  appName: string;
  
  // Short tagline for auth pages
  tagline: string;
  
  // Single letter for logo icon
  logoLetter: string;
  
  // CSS gradient for primary buttons and logo
  primaryGradient: string;
  
  // CSS gradient for hover state
  primaryGradientHover: string;
  
  // Box shadow for logo
  logoShadow: string;
  
  // Route to redirect after login
  dashboardRoute: string;
  
  // Success messages
  messages: {
    loginSuccess: string;
    registerSuccess: string;
    googleNewUser: string;
  };
  
  // Security badge text
  securityBadge: string;
}

// Auth API interface - matches frontblok-auth's authApi.
// Components need these methods to work.
// Uses generic return types to be compatible with various implementations.
export interface AuthApi {
  requestPasswordReset: (email: string) => Promise<unknown>;
  resetPassword: (token: string, newPassword: string) => Promise<unknown>;
  verifyEmail: (token: string) => Promise<unknown>;
  googleLogin: (credential: string) => Promise<{ is_new_user?: boolean }>;
}

// Auth hook return type - matches useClientAuth from frontblok-auth.
export interface AuthHook {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

// Common props for all views that need auth and branding.
export interface ViewProps {
  // Branding configuration
  branding: Branding;
  
  // Auth API instance
  authApi: AuthApi;
}

// Props for AuthView which also needs the auth hook and nonce generator.
export interface AuthViewProps extends ViewProps {
  // Auth hook (login, register, isLoading, error)
  useAuth: () => AuthHook;
  
  // Generate OAuth nonce for Google login
  generateOAuthNonce: () => string;
}

// Props for ErrorBoundary.
export interface ErrorBoundaryProps {
  children: ReactNode;
  supportEmail?: string;
}

// Props for ConfirmationModal.
export type ConfirmationModalSeverity = 'info' | 'warning' | 'error' | 'success';

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  severity?: ConfirmationModalSeverity;
  isLoading?: boolean;
  warning?: string;
  details?: { label: string; oldValue: string; newValue: string }[];
  bulletPoints?: string[];
}
