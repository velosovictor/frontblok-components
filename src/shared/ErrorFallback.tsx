// ========================================================================
// STYLED ERROR FALLBACK
// ========================================================================
// Beautiful error fallback UI using MUI components.
// ========================================================================

import React from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  resetError: () => void;
  supportEmail: string;
}

// Styled Error Fallback
//
// Use this as the renderFallback prop for ErrorBoundary:
//
// <ErrorBoundary renderFallback={ErrorFallback}>
//   <App />
// </ErrorBoundary>
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
  supportEmail,
}) => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
            }}
          />
          
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Oops! Something went wrong
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're sorry for the inconvenience. An unexpected error occurred.
            Our team has been notified and we're working on a fix.
          </Typography>

          {/* Show error details in development mode */}
          {import.meta.env.DEV && error && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                textAlign: 'left',
                backgroundColor: '#f5f5f5',
                maxHeight: 300,
                overflow: 'auto',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Error Details (Development Only):
              </Typography>
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {error.toString()}
                {errorInfo?.componentStack}
              </Typography>
            </Paper>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={resetError}
              size="large"
            >
              Return to Home
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => window.location.reload()}
              size="large"
            >
              Reload Page
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 3, display: 'block' }}
          >
            If the problem persists, please contact{' '}
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ErrorFallback;
