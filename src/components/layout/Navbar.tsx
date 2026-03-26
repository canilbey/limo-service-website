import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  useScrollTrigger,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { brandColors } from '../../theme';
import { SITE_EMAIL, SITE_EMAIL_HREF, SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from '../../constants/site';

const NAV_LINKS = [
  { label: 'Services', sectionId: 'why-choose-us' },
  { label: 'Fleet', sectionId: 'fleet' },
  { label: 'About', sectionId: 'about' },
  { label: 'Contact', sectionId: 'contact' },
];

export default function Navbar() {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 10 });
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  const drawer = (
    <Box sx={{ width: 280, pt: 2, pb: 2, backgroundColor: '#080C17', minHeight: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
        <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu" sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ px: 1 }}>
        {NAV_LINKS.map(({ label, sectionId }) => (
          <ListItemButton key={label} onClick={() => handleNavClick(sectionId)} sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemText primary={label} primaryTypographyProps={{ sx: { color: brandColors.textSecondary, fontWeight: 600 } }} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 2, borderColor: brandColors.border }} />
        <ListItemButton component="a" href={SITE_PHONE_HREF} sx={{ borderRadius: 1 }}>
          <PhoneIcon sx={{ color: brandColors.primary, mr: 1.5, fontSize: 20 }} />
          <ListItemText primary={SITE_PHONE_DISPLAY} primaryTypographyProps={{ sx: { color: '#fff' } }} />
        </ListItemButton>
        <ListItemButton component="a" href={SITE_EMAIL_HREF} sx={{ wordBreak: 'break-all', borderRadius: 1 }}>
          <EmailIcon sx={{ color: brandColors.primary, mr: 1.5, fontSize: 20 }} />
          <ListItemText primary={SITE_EMAIL} primaryTypographyProps={{ sx: { color: brandColors.textSecondary, fontSize: '0.9rem' } }} />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/about" onClick={() => setMobileOpen(false)} sx={{ borderRadius: 1 }}>
          <ListItemText primary="About page" primaryTypographyProps={{ sx: { color: brandColors.textSecondary } }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: trigger ? 'rgba(10, 14, 26, 0.95)' : 'transparent',
        backdropFilter: trigger ? 'blur(20px)' : 'none',
        borderBottom: trigger ? `1px solid ${brandColors.border}` : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1, px: { xs: 0, sm: 0 } }}>
          <IconButton
            color="inherit"
            aria-label="Open menu"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' }, mr: 1, color: '#fff' }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em', color: '#fff', lineHeight: 1.1 }}>
                BUDGET LIMOUSINE
              </Typography>
              <Typography sx={{ color: brandColors.primary, letterSpacing: '0.15em', fontSize: '0.6rem', fontWeight: 500 }}>
                A RIDE WITH CLASS
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {NAV_LINKS.map(({ label, sectionId }) => (
              <Button
                key={label}
                onClick={() => handleNavClick(sectionId)}
                sx={{
                  color: brandColors.textSecondary,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  '&:hover': { color: '#fff' },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 }, ml: { xs: 0, md: 2 } }}>
            <Box
              component="a"
              href={SITE_PHONE_HREF}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                color: brandColors.textSecondary,
                textDecoration: 'none',
                '&:hover': { color: '#fff' },
              }}
            >
              <PhoneIcon sx={{ fontSize: { xs: 20, sm: 16 }, color: brandColors.primary }} />
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.85rem', fontWeight: 500 }}>
                {SITE_PHONE_DISPLAY}
              </Typography>
            </Box>
            <Box
              component="a"
              href={SITE_EMAIL_HREF}
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                color: brandColors.textSecondary,
                textDecoration: 'none',
                maxWidth: 200,
                '&:hover': { color: brandColors.primary },
              }}
            >
              <EmailIcon sx={{ fontSize: 16, color: brandColors.primary, flexShrink: 0 }} />
              <Typography variant="body2" noWrap sx={{ fontSize: '0.8rem' }}>
                {SITE_EMAIL}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>

      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { backgroundColor: '#080C17' } }}>
        {drawer}
      </Drawer>
    </AppBar>
  );
}
