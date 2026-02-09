// ========================================================================
// SETTINGS VIEW
// ========================================================================
// Universal user settings and account management view.
// Works with any frontblok-auth API instance.
//
// Features:
// - Profile information display
// - Sign out
// - Account deletion with confirmation dialog
//
// This is the base settings view that every RationalBloks app needs.
// Apps can extend it by wrapping or composing additional sections.
//
// Usage:
//   import { SettingsView } from '@rationalbloks/frontblok-components';
//   
//   <SettingsView
//     authApi={authApi}
//     useAuth={useClientAuth}
//   />
// ========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Avatar,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  DeleteForever as DeleteIcon,
} from '@mui/icons-material';

// ========================================================================
// TYPES
// ========================================================================

export interface SettingsViewAuthApi {
  deleteAccount: (password: string, confirmText: string) => Promise<{ message: string; note: string }>;
}

export interface SettingsViewUser {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface SettingsViewProps {
  /** The auth API instance (must have deleteAccount method) */
  authApi: SettingsViewAuthApi;
  /** The useAuth hook from your app */
  useAuth: () => {
    user: SettingsViewUser | null;
    logout: () => void;
  };
  /** Route to navigate to after logout/delete. Default: '/' */
  homeRoute?: string;
  /** Optional additional content to render between profile and danger zone */
  children?: React.ReactNode;
}

// ========================================================================
// COMPONENT
// ========================================================================

export const SettingsView: React.FC<SettingsViewProps> = ({
  authApi,
  useAuth,
  homeRoute = '/',
  children,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(homeRoute);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    if (!deletePassword) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authApi.deleteAccount(deletePassword, deleteConfirmation);
      logout();
      navigate(homeRoute);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your account settings and preferences.
      </Typography>

      {/* Profile Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Profile Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {user?.first_name?.charAt(0).toUpperCase() || <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Account Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Account Actions
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontWeight={500}>Sign Out</Typography>
              <Typography variant="body2" color="text.secondary">
                Sign out of your account on this device.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Optional additional content (app-specific settings sections) */}
      {children}

      {/* Danger Zone */}
      <Paper sx={{ p: 3, border: '1px solid', borderColor: 'error.main' }}>
        <Typography variant="h6" fontWeight={600} color="error" gutterBottom>
          Danger Zone
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography fontWeight={500}>Delete Account</Typography>
            <Typography variant="body2" color="text.secondary">
              Permanently delete your account and all associated data.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <Typography paragraph>
            Enter your password and type <strong>DELETE</strong> to confirm:
          </Typography>
          <TextField
            fullWidth
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter your password"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE to confirm"
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete My Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsView;
