import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HistoryIcon from '@mui/icons-material/History';
import CampaignIcon from '@mui/icons-material/Campaign';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import { brandColors } from '../../theme';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Approvals', path: '/admin/pending', icon: <PendingActionsIcon /> },
  { label: 'Customer history', path: '/admin/history', icon: <HistoryIcon /> },
  { label: 'Google Ads', path: '/admin/google-ads', icon: <CampaignIcon /> },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuth();

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: brandColors.card,
        borderRight: `1px solid ${brandColors.border}`,
      }}
    >
      <Toolbar sx={{ px: 2, borderBottom: `1px solid ${brandColors.border}` }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
          Admin
        </Typography>
      </Toolbar>
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 107, 0, 0.12)',
                borderLeft: `3px solid ${brandColors.primary}`,
              },
            }}
          >
            <ListItemIcon sx={{ color: brandColors.primary, minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2, mt: 'auto' }}>
        <ListItemButton
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          sx={{ borderRadius: 2, border: `1px solid ${brandColors.border}` }}
        >
          <ListItemIcon sx={{ color: brandColors.textMuted, minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItemButton>
        {username && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: brandColors.textMuted, px: 1 }}>
            {username}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: brandColors.background }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: `${brandColors.background}ee`,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${brandColors.border}`,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: 'none' }, color: brandColors.textSecondary }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: '#fff' }}>
            Budget Limousine — Control panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: brandColors.card,
              borderRight: `1px solid ${brandColors.border}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: brandColors.card,
              borderRight: `1px solid ${brandColors.border}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
