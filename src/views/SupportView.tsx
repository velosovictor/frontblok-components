/**
 * Support View - Simplified & Clean
 */
import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const SupportView = () => {
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormChange = (field: string) => (event: { target: { value: string } }) => {
    setSupportForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmitSupport = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setSupportForm({ subject: '', message: '' });
    }, 3000);
  };

  return (
    <Box sx={{ maxWidth: '1400px', margin: '0 auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Support
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Need help? Send us a message and we'll get back to you within 4 hours
        </Typography>
        
        {/* Status */}
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon />}
          sx={{ 
            maxWidth: 600,
            '& .MuiAlert-message': {
              fontSize: '0.9rem',
            }
          }}
        >
          All systems operational • Average response: 2.3 hours
        </Alert>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
        {/* Support Form */}
        <Card sx={{ boxShadow: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Send Support Request
            </Typography>
            
            {formSubmitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Request submitted! We'll respond within 4 hours.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmitSupport}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={supportForm.subject}
                  onChange={handleFormChange('subject')}
                  placeholder="Brief description of your issue"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={8}
                  value={supportForm.message}
                  onChange={handleFormChange('message')}
                  placeholder="Please provide details about your issue..."
                  required
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SendIcon />}
                  disabled={formSubmitted}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                >
                  Send Request
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Help Sidebar */}
        <Box>
          <Card sx={{ boxShadow: 2, bgcolor: 'primary.lighter' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Help
              </Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  • Check the Documentation page for API guides
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • View your API usage on the Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Manage projects in the Projects page
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2, mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Response Time
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Average response
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Within 4 hours
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  Monday - Friday
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  9:00 AM - 6:00 PM PST
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default SupportView;