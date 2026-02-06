// ========================================================================
// PASSWORD RESET REQUEST VIEW
// Allows users to request a password reset link via email
// ========================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Email as EmailIcon, ArrowBack } from '@mui/icons-material';

export interface ForgotPasswordViewProps {
  /** Auth API object with requestPasswordReset method */
  authApi: {
    requestPasswordReset: (email: string) => Promise<unknown>;
  };
  /** Route to navigate back to login (default: '/auth') */
  authRoute?: string;
}

export default function ForgotPasswordView({ authApi, authRoute = '/auth' }: ForgotPasswordViewProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authApi.requestPasswordReset(email) as { dev_token?: string } | undefined;
      setSuccess(true);
      
      // Show dev token in development mode ONLY (Vite exposes import.meta.env.DEV)
      if (import.meta.env.DEV && result?.dev_token) {
        console.log('[DEV] Password reset token:', result.dev_token);
        alert(`[DEV MODE] Reset token: ${result.dev_token}\nUse this at /reset-password?token=${result.dev_token}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box textAlign="center">
            <EmailIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Check Your Email
            </Typography>
            <Typography color="text.secondary" paragraph>
              If an account exists with the email <strong>{email}</strong>, 
              you will receive a password reset link shortly.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The link will expire in 1 hour for security reasons.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(authRoute)}
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(authRoute)}
          sx={{ mb: 2 }}
        >
          Back to Login
        </Button>

        <Typography variant="h4" gutterBottom>
          Reset Password
        </Typography>
        <Typography color="text.secondary" paragraph>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <EmailIcon />}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
