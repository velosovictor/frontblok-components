// ========================================================================
// STYLED CONFIRMATION MODAL
// ========================================================================
// Beautiful confirmation modal with MUI aesthetics.
// ========================================================================

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  alpha,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

export type ConfirmationModalSeverity = 'info' | 'warning' | 'error' | 'success';

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  severity?: ConfirmationModalSeverity;
  isLoading?: boolean;
  warning?: string;
  details?: { label: string; oldValue: string; newValue: string }[];
  bulletPoints?: string[];
}

const severityConfig = {
  info: { icon: InfoIcon, color: 'info.main', bgColor: 'info.light' },
  warning: { icon: WarningIcon, color: 'warning.main', bgColor: 'warning.light' },
  error: { icon: ErrorIcon, color: 'error.main', bgColor: 'error.light' },
  success: { icon: SuccessIcon, color: 'success.main', bgColor: 'success.light' },
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'info',
  isLoading = false,
  warning,
  details,
  bulletPoints,
}) => {
  const config = severityConfig[severity];
  const IconComponent = config.icon;

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => alpha(theme.palette[severity].main, 0.1),
          }}
        >
          <IconComponent sx={{ color: config.color, fontSize: 24 }} />
        </Box>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {message}
        </Typography>

        {details && details.length > 0 && (
          <Box
            sx={{
              bgcolor: 'grey.50',
              borderRadius: 1,
              p: 2,
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
              Changes:
            </Typography>
            {details.map((detail, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.75,
                  borderBottom: index < details.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {detail.label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {detail.oldValue}
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={600}>
                    →
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={600}>
                    {detail.newValue}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {warning && (
          <Alert
            severity="warning"
            icon={<WarningIcon />}
            sx={{
              mb: 2,
              '& .MuiAlert-message': {
                fontWeight: 500,
              },
            }}
          >
            {warning}
          </Alert>
        )}

        {bulletPoints && bulletPoints.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              This action will:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {bulletPoints.map((point, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{ mb: 0.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {point}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          color={severity === 'error' ? 'error' : severity === 'warning' ? 'warning' : 'primary'}
          sx={{ minWidth: 120 }}
          startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
