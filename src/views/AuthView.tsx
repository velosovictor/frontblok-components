// ============================================================================
// AUTH VIEW
// ============================================================================
// Login and registration page with configurable branding.
// Props-based: pass branding, authApi, useAuth, generateOAuthNonce.
//
// Design:
// - All customization via props
// - No hidden imports or context
// - Google OAuth with CSRF nonce protection
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Container,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Link,
  IconButton,
  InputAdornment,
  useTheme,
  Stack
} from '@mui/material';
import {
  Email,
  Lock,
  Person,
  Business,
  Visibility,
  VisibilityOff,
  Security
} from '@mui/icons-material';
import { AuthViewProps } from '../types';

export const AuthView: React.FC<AuthViewProps> = ({
  branding,
  authApi,
  useAuth,
  generateOAuthNonce,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, register, isLoading, error } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Generate nonce once on component mount for Google OAuth
  const [oauthNonce] = useState(() => generateOAuthNonce());

  useEffect(() => {
    console.log('[SECURITY] OAuth nonce generated:', oauthNonce.substring(0, 8) + '...');
  }, [oauthNonce]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setLocalError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setLocalError('Email and password are required');
      return false;
    }

    if (mode === 'register') {
      if (!formData.name) {
        setLocalError('Name is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setLocalError('Password must be at least 6 characters');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLocalError('');

    try {
      if (mode === 'login') {
        const success = await login(formData.email, formData.password);
        if (success) {
          setSuccess(branding.messages.loginSuccess);
          setTimeout(() => {
            navigate(branding.dashboardRoute);
          }, 1500);
        }
      } else {
        // Split name into first and last name
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0] || formData.name;
        const lastName = nameParts.slice(1).join(' ') || 'User';
        
        const success = await register(formData.email, formData.password, firstName, lastName);
        if (success) {
          setSuccess(branding.messages.registerSuccess);
          setTimeout(() => {
            navigate(branding.dashboardRoute);
          }, 1500);
        }
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setLocalError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      name: '',
      company: '',
      confirmPassword: ''
    });
  };

  // Google OAuth success handler
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLocalError('');
      
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Single call handles nonce verification and cleanup
      const result = await authApi.googleLogin(credentialResponse.credential);
      
      if (result.is_new_user) {
        setSuccess(branding.messages.googleNewUser);
      }
      
      window.location.href = branding.dashboardRoute;
      
    } catch (err: any) {
      setLocalError(err.message || 'Google authentication failed');
    }
  };

  const handleGoogleError = () => {
    setLocalError('Google authentication failed. Please try again.');
  };

  const displayError = localError || error;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'var(--basecamp-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: { xs: 0, md: 4 },
      px: { xs: 0, md: 3 }
    }}>
      <Container maxWidth="sm" sx={{ px: { xs: 0, md: 3 } }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 400, md: 380 },
            margin: '0 auto',
            boxShadow: { xs: 'none', md: '0 8px 40px rgba(30, 64, 175, 0.12)' },
            border: { xs: 'none', md: '1px solid rgba(30, 64, 175, 0.08)' },
            borderRadius: { xs: 0, md: 2.5 },
            overflow: 'hidden',
            minHeight: { xs: '100vh', md: 'auto' }
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5, md: 4 } }}>
            {/* Logo & Brand - Uses BRANDING config */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2.5, md: 3.5 } }}>
              <Box
                sx={{
                  width: { xs: 48, md: 56 },
                  height: { xs: 48, md: 56 },
                  background: branding.primaryGradient,
                  borderRadius: { xs: 1.5, md: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: { xs: 1.5, md: 2 },
                  boxShadow: branding.logoShadow,
                }}
              >
                <Typography sx={{ 
                  fontWeight: 900, 
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  color: 'white',
                }}>
                  {branding.logoLetter}
                </Typography>
              </Box>
              
              <Typography 
                variant="h4" 
                fontWeight={800} 
                sx={{ 
                  mb: { xs: 0.25, md: 0.5 }, 
                  color: 'text.primary',
                  fontSize: { xs: '1.375rem', sm: '1.5rem', md: '1.75rem' }
                }}
              >
                {branding.appName}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.8125rem', md: '0.875rem' } }}
              >
                {branding.tagline}
              </Typography>
            </Box>

            {/* Google OAuth - Custom Styled Button */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => {
                const googleBtn = document.querySelector('[role="button"]') as HTMLElement;
                if (googleBtn) googleBtn.click();
              }}
              sx={{
                py: { xs: 1.1, md: 1.3 },
                mb: { xs: 2, md: 2.5 },
                borderColor: 'rgba(0, 0, 0, 0.23)',
                color: 'text.primary',
                textTransform: 'none',
                fontSize: { xs: '0.875rem', md: '0.9375rem' },
                fontWeight: 500,
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.4)',
                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                },
                display: 'flex',
                gap: 1.5,
                justifyContent: 'center'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>

            {/* Hidden Google Login Component */}
            <Box sx={{ display: 'none' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                nonce={oauthNonce}
              />
            </Box>

            <Divider sx={{ my: { xs: 2, md: 2.5 } }}>
              <Chip label="or" size="small" sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }} />
            </Divider>

            {/* Alerts */}
            {displayError && (
              <Alert severity="error" sx={{ mb: { xs: 2, md: 2.5 }, fontSize: { xs: '0.8125rem', md: '0.875rem' } }}>
                {displayError}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: { xs: 2, md: 2.5 }, fontSize: { xs: '0.8125rem', md: '0.875rem' } }}>
                {success}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={{ xs: 1.75, md: 2 }}>
                {mode === 'register' && (
                  <>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Company Name (Optional)"
                      value={formData.company}
                      onChange={handleInputChange('company')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                {mode === 'register' && (
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                  sx={{
                    py: { xs: 1.1, md: 1.3 },
                    fontSize: { xs: '0.875rem', md: '0.9375rem' },
                    fontWeight: 600,
                    textTransform: 'none',
                    mt: { xs: 0.5, md: 0.75 },
                    background: branding.primaryGradient,
                    '&:hover': {
                      background: branding.primaryGradientHover,
                    }
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </Stack>
            </Box>

            {/* Footer Links */}
            <Box sx={{ textAlign: 'center', mt: { xs: 2.5, md: 3 } }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8125rem', md: '0.875rem' } }}>
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <Link
                  component="button"
                  type="button"
                  onClick={switchMode}
                  sx={{
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontSize: { xs: '0.8125rem', md: '0.875rem' },
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {mode === 'login' ? 'Sign up free' : 'Sign in'}
                </Link>
              </Typography>
            </Box>

            {mode === 'login' && (
              <Box sx={{ textAlign: 'center', mt: { xs: 1.5, md: 2 } }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => navigate('/forgot-password')}
                  sx={{
                    color: theme.palette.text.secondary,
                    textDecoration: 'none',
                    fontSize: { xs: '0.75rem', md: '0.8125rem' },
                    '&:hover': {
                      textDecoration: 'underline',
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>
            )}

            {/* Security Badge */}
            <Box sx={{ textAlign: 'center', mt: { xs: 2.5, md: 3 }, pt: { xs: 2.5, md: 3 }, borderTop: '1px solid', borderColor: 'divider' }}>
              <Chip 
                icon={<Security sx={{ fontSize: { xs: '12px', md: '13px' } }} />}
                label={branding.securityBadge}
                variant="outlined"
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  borderColor: 'divider',
                  fontSize: { xs: '0.6875rem', md: '0.75rem' }
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AuthView;
