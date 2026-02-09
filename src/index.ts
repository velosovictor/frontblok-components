// ============================================================================
// FRONTBLOK COMPONENTS
// ============================================================================
// Reusable React components for RationalBloks frontends.
// Props-based API for maximum flexibility and explicitness.
//
// USAGE:
// ```tsx
// import { 
//   AuthView, 
//   ForgotPasswordView,
//   ErrorBoundary,
//   ConfirmationModal,
//   createNavbar 
// } from '@rationalbloks/frontblok-components';
//
// // In your app
// <ErrorBoundary supportEmail="support@myapp.com">
//   <Routes>
//     <Route path="/auth" element={
//       <AuthView 
//         branding={BRANDING}
//         authApi={authApi}
//         useAuth={useClientAuth}
//         generateOAuthNonce={generateOAuthNonce}
//       />
//     } />
//   </Routes>
// </ErrorBoundary>
// ```
// ============================================================================

// Types from types.ts
export type {
  Branding,
  AuthApi,
  AuthHook,
  ViewProps,
  AuthViewProps,
  ErrorBoundaryProps,
  ConfirmationModalProps,
  ConfirmationModalSeverity,
} from './types';

// Shared Components
export { default as ErrorBoundary } from './shared/ErrorBoundary';
export { ConfirmationModal } from './shared/ConfirmationModal';
export { ErrorFallback } from './shared/ErrorFallback';
export type { ErrorFallbackProps } from './shared/ErrorFallback';

// Navbar Factory
export { 
  createNavbar,
  type NavbarConfig,
  type NavigationItem,
  type BrandConfig,
  type NavigationConfig,
  type AuthHookResult as NavbarAuthHookResult,
} from './shared/Navbar';

// Views
export { AuthView } from './views/AuthView';
export { default as ForgotPasswordView } from './views/ForgotPasswordView';
export { default as ResetPasswordView } from './views/ResetPasswordView';
export { default as VerifyEmailView } from './views/VerifyEmailView';
export { default as SupportView } from './views/SupportView';
export { SettingsView } from './views/SettingsView';

// View Props Types
export type { ForgotPasswordViewProps } from './views/ForgotPasswordView';
export type { ResetPasswordViewProps } from './views/ResetPasswordView';
export type { VerifyEmailViewProps } from './views/VerifyEmailView';
export type { SettingsViewProps, SettingsViewAuthApi, SettingsViewUser } from './views/SettingsView';

// Theme
export { 
  createAppTheme, 
  defaultPalette, 
  defaultTypography, 
  defaultComponents, 
  defaultNavbarGradient 
} from './theme';
export type { AppThemeOptions } from './theme';
