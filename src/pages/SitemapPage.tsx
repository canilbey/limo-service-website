import { Container, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PublicPageLayout from '../components/layout/PublicPageLayout';
import { brandColors } from '../theme';
import { SITE_ORIGIN, FOOTER_SERVICE_LINKS } from '../constants/site';

const routes = [
  { to: '/', label: 'Home' },
  { to: '/select-vehicle', label: 'Select vehicle (booking)' },
  { to: '/about', label: 'About Us' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/cookie-policy', label: 'Cookie Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/payment-cancellation-policy', label: 'Payment & Cancellation Policy' },
  { to: '/sitemap', label: 'Sitemap' },
] as const;

export default function SitemapPage() {
  return (
    <PublicPageLayout
      title="Sitemap"
      metaDescription="Sitemap for Budget Limousine — quick links to booking, legal pages, and company information."
    >
      <Container maxWidth="sm">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Sitemap
        </Typography>
        <Typography variant="body1" sx={{ color: brandColors.textSecondary, mb: 3, lineHeight: 1.8 }}>
          Browse primary pages on {SITE_ORIGIN}. Service-specific landing context is available on the home page using the
          links below.
        </Typography>

        <Typography variant="subtitle2" sx={{ color: brandColors.primary, mb: 1, letterSpacing: '0.08em' }}>
          Main pages
        </Typography>
        <List dense sx={{ mb: 4 }}>
          {routes.map(({ to, label }) => (
            <ListItem key={to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton component={RouterLink} to={to} sx={{ borderRadius: 1, border: `1px solid ${brandColors.border}` }}>
                <ListItemText primary={label} primaryTypographyProps={{ sx: { color: '#fff', fontWeight: 600 } }} secondary={to} secondaryTypographyProps={{ sx: { color: brandColors.textMuted, fontSize: '0.8rem' } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Typography variant="subtitle2" sx={{ color: brandColors.primary, mb: 1, letterSpacing: '0.08em' }}>
          Service highlights (home)
        </Typography>
        <List dense>
          {FOOTER_SERVICE_LINKS.map(({ label, slug }) => (
            <ListItem key={slug} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton component={RouterLink} to={`/?service=${slug}`} sx={{ borderRadius: 1, border: `1px solid ${brandColors.border}` }}>
                <ListItemText primary={label} primaryTypographyProps={{ sx: { color: '#fff' } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Container>
    </PublicPageLayout>
  );
}
