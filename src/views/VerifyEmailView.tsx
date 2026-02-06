// ========================================================================
// EMAIL VERIFICATION VIEW
// Verifies user's email address using token from verification email
// ========================================================================

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';

export interface VerifyEmailViewProps {
  /** Auth API object with verifyEmail method */
  authApi: {
    verifyEmail: (token: string) => Promise<unknown>;
  };
  /** Route to navigate after successful verification (default: '/projects') */
  successRoute?: string;
  /** Route to navigate on error (default: '/settings') */
  errorRoute?: string;
}

export default function VerifyEmailView({ 
  authApi, 
  successRoute = '/projects',
  errorRoute = '/settings'
}: VerifyEmailViewProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid or missing verification token');
        setLoading(false);
        return;
      }

      try {
        await authApi.verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify email');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box textAlign="center">
            <CircularProgress size={64} sx={{ mb: 2 }} />
            <Typography variant="h5">
              Verifying your email...
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box textAlign="center">
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Email Verified!
            </Typography>
            <Typography color="text.secondary" paragraph>
              Your email address has been successfully verified. 
              You can now access all features of your account.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(successRoute)}
              sx={{ mt: 2 }}
            >
              Continue
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center">
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Verification Failed
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography color="text.secondary" paragraph>
            The verification link may have expired or is invalid. 
            Please request a new verification email from your account settings.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(errorRoute)}
            sx={{ mt: 2 }}
          >
            Go to Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
