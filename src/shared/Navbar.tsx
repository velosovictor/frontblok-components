// ========================================================================
// STYLED NAVBAR
// ========================================================================
// Configurable styled navbar with MUI aesthetics.
// All the visual aesthetics (gradient, colors, shadows, etc.) are defined here.
// ========================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import {
  ExitToApp,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// ========================================================================
// TYPE DEFINITIONS
// ========================================================================

export interface NavigationItem {
  id: string;       // Route path
  label: string;    // Display text
  icon: React.ReactElement;
}

export interface BrandConfig {
  name: string;
  logo: string;
}

export interface NavigationConfig {
  public: NavigationItem[];
  authenticated: NavigationItem[];
}

export interface AuthHookResult {
  user: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export interface NavbarConfig {
  brand: BrandConfig;
  navigation: NavigationConfig;
  useAuth: () => AuthHookResult;
  // Gradient colors for navbar background
  navbarGradient: {
    start: string;  // e.g., '#1800ad'
    end: string;    // e.g., '#0d0067'
  };
  userRoleLabel?: string;
  authRoute?: string;
  settingsRoute?: string;
  isActiveOverride?: (path: string, locationPath: string) => boolean;
}

// ========================================================================
// NAVBAR FACTORY
// ========================================================================

export function createNavbar(config: NavbarConfig) {
  const {
    brand,
    navigation,
    useAuth,
    navbarGradient,
    userRoleLabel = 'User',
    authRoute = '/auth',
    settingsRoute = '/settings',
    isActiveOverride,
  } = config;

  // Return the configured Navbar component
  const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: { currentTarget: HTMLElement }) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleLogout = () => {
      handleMenuClose();
      logout();
      navigate('/');
    };

    // Close menu on scroll - professional UX
    useEffect(() => {
      const handleScroll = () => {
        if (anchorEl) {
          handleMenuClose();
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [anchorEl]);

    // Check if a nav item is active
    const isActive = (path: string): boolean => {
      if (isActiveOverride) {
        return isActiveOverride(path, location.pathname);
      }
      return location.pathname === path;
    };

    // Build navigation items based on auth state
    const getNavigationItems = (): NavigationItem[] => {
      if (!isAuthenticated) {
        return navigation.public;
      }
      return [...navigation.public, ...navigation.authenticated];
    };

    const navigationItems = getNavigationItems();
    const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: `linear-gradient(135deg, ${navbarGradient.start} 0%, ${navbarGradient.end} 100%)`,
        boxShadow: '0 4px 20px rgba(24, 0, 173, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        top: 0,
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        {/* Logo - Clickable Home Button with Icon */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.85
            },
            transition: 'opacity 0.2s ease'
          }}
          onClick={() => navigate('/')}
        >
          {/* Logo Icon */}
          <Box
            component="img"
            src={brand.logo}
            alt={brand.name}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              mr: 2,
              boxShadow: '0 2px 8px rgba(96, 165, 250, 0.3)'
            }}
          />
          
          {/* Brand Name */}
          <Typography variant="h6" component="div" sx={{ 
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '-0.5px',
            color: 'white'
          }}>
            {brand.name}
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          alignItems: 'center', 
          gap: 1, 
          mr: 3 
        }}>
          {navigationItems.slice(1).map((item) => (
            <Button
              key={item.id}
              color="inherit"
              component={Link}
              to={item.id}
              startIcon={React.cloneElement(item.icon as React.ReactElement<{ sx?: object }>, { sx: { fontSize: '18px' } })}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                py: 1,
                borderRadius: '8px',
                backgroundColor: isActive(item.id) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Auth Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isAuthenticated ? (
            <Button
              variant="contained"
              onClick={() => navigate(authRoute)}
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Access Portal
            </Button>
          ) : (
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="inherit"
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          )}
        </Box>

        {/* User Dropdown Menu */}
        {isAuthenticated && (
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 280,
                maxWidth: 320,
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                '& .MuiList-root': {
                  py: 1
                },
                '& .MuiMenuItem-root': {
                  py: 1.25,
                  px: 2.5,
                  mx: 1,
                  my: 0.25,
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    transform: 'translateX(2px)'
                  }
                },
              },
            }}
            slotProps={{
              paper: {
                elevation: 0
              }
            }}
          >
            {/* User Info Header */}
            <Box sx={{ 
              px: 3, 
              py: 2.5, 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar 
                  sx={{ 
                    width: 44, 
                    height: 44, 
                    bgcolor: 'primary.main',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    mr: 1.5,
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)'
                  }}
                >
                  {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="600" 
                    sx={{ 
                      mb: 0.25,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user ? `${user.first_name} ${user.last_name}` : 'User'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user?.email || 'user@example.com'}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                size="small" 
                label={userRoleLabel}
                color="primary"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px'
                }}
              />
            </Box>

            {/* Menu Items */}
            <Box sx={{ py: 0.5 }}>
              <MenuItem onClick={() => { navigate(settingsRoute); handleMenuClose(); }}>
                <SettingsIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight="500">Settings</Typography>
              </MenuItem>
              
              <Divider sx={{ my: 0.5, mx: 1 }} />
              
              <MenuItem 
                onClick={handleLogout} 
                sx={{ 
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.08)'
                  }
                }}
              >
                <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
                <Typography variant="body2" fontWeight="500">Sign Out</Typography>
              </MenuItem>
            </Box>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
  };

  return Navbar;
}
