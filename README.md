# @rationalbloks/frontblok-components

Reusable React components for RationalBloks frontends.

## Design Principles

**Props-based API**

- All customization via props (no hidden context)
- Each component is self-contained
- TypeScript types for everything
- Works with frontblok-auth

## Installation

```bash
npm install @rationalbloks/frontblok-components
```

## Peer Dependencies

```json
{
  "@mui/material": "^5.0.0 || ^6.0.0 || ^7.0.0",
  "@mui/icons-material": "^5.0.0 || ^6.0.0 || ^7.0.0",
  "@emotion/react": "^11.0.0",
  "@emotion/styled": "^11.0.0",
  "@react-oauth/google": "^0.12.0",
  "@rationalbloks/frontblok-auth": "^0.3.0",
  "react": "^18.0.0 || ^19.0.0",
  "react-router-dom": "^6.0.0 || ^7.0.0"
}
```

## Components

### Views

| Component | Props | Description |
|-----------|-------|-------------|
| `AuthView` | `branding`, `authApi`, `useAuth`, `generateOAuthNonce` | Login/register with Google OAuth |
| `ForgotPasswordView` | `authApi`, `authRoute?` | Request password reset |
| `ResetPasswordView` | `authApi`, `authRoute?` | Set new password |
| `VerifyEmailView` | `authApi`, `successRoute?`, `errorRoute?` | Email verification |
| `SupportView` | (none) | Support request form |

### Shared

| Component | Props | Description |
|-----------|-------|-------------|
| `ErrorBoundary` | `children`, `supportEmail?` | React error boundary |
| `ErrorFallback` | `error`, `errorInfo`, `resetError`, `supportEmail` | Error display component |
| `ConfirmationModal` | `open`, `onClose`, `onConfirm`, `title`, `message`, ... | Confirmation dialog |
| `createNavbar(config)` | Factory function | Creates configured navbar component |

## Usage

```tsx
import { 
  AuthView, 
  ForgotPasswordView,
  ResetPasswordView,
  VerifyEmailView,
  SupportView,
  ErrorBoundary,
  ConfirmationModal 
} from '@rationalbloks/frontblok-components';
import { authApi, useClientAuth, generateOAuthNonce } from './services/datablokApi';
import { BRANDING } from './config/branding';

function App() {
  return (
    <ErrorBoundary supportEmail="support@myapp.com">
      <Routes>
        <Route path="/auth" element={
          <AuthView 
            branding={BRANDING}
            authApi={authApi}
            useAuth={useClientAuth}
            generateOAuthNonce={generateOAuthNonce}
          />
        } />
        <Route path="/forgot-password" element={
          <ForgotPasswordView authApi={authApi} />
        } />
        <Route path="/reset-password" element={
          <ResetPasswordView authApi={authApi} />
        } />
        <Route path="/verify-email" element={
          <VerifyEmailView 
            authApi={authApi} 
            successRoute="/dashboard"
            errorRoute="/settings"
          />
        } />
        <Route path="/support" element={
          <SupportView />
        } />
      </Routes>
    </ErrorBoundary>
  );
}
```

## Branding Configuration

Create a `config/branding.ts` in your app:

```typescript
export const BRANDING = {
  appName: 'My App',
  tagline: 'Welcome',
  logoLetter: 'M',
  primaryGradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
  primaryGradientHover: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
  logoShadow: '0 4px 20px rgba(30, 64, 175, 0.3)',
  dashboardRoute: '/dashboard',
  messages: {
    loginSuccess: 'Login successful!',
    registerSuccess: 'Account created!',
    googleNewUser: 'Welcome! Account created.',
  },
  securityBadge: 'Secure Access',
};
```

## License

MIT
