import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import PublicPageLayout from '../components/layout/PublicPageLayout';
import { brandColors } from '../theme';
import { SITE_EMAIL, SITE_EMAIL_HREF } from '../constants/site';

export default function CookiePolicyPage() {
  return (
    <PublicPageLayout
      title="Cookie Policy"
      metaDescription="How Budget Limousine uses cookies and similar technologies on our website, and how you can manage preferences."
    >
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Cookie Policy
        </Typography>
        <Typography variant="body2" sx={{ color: brandColors.textMuted, mb: 4 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary, mb: 3 }}>
          This Cookie Policy explains how Budget Limousine (“we”, “us”) uses cookies and similar technologies when you
          visit our website. It should be read together with our Privacy Policy.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            What are cookies?
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            Cookies are small text files stored on your device. They help websites function, remember preferences,
            understand how visitors use pages, and improve performance and security.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Types of cookies we may use
          </Typography>
          <List dense sx={{ color: brandColors.textSecondary }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Strictly necessary: required for core site functions such as security, load balancing, and booking form operation." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Preferences: remember choices such as language or region where those features are enabled." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Analytics / performance: help us understand aggregate traffic and usage patterns to improve the website." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
              <ListItemText primary="Functional: enable enhanced features related to maps, embedded content, or session continuity." />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Local storage and similar technologies
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            We may use browser local storage or session storage for application state (for example, keeping your booking
            progress stable while you navigate). These technologies serve similar purposes to cookies and can be cleared
            through your browser settings.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Managing cookies
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            Most browsers let you refuse or delete cookies. If you block strictly necessary cookies, parts of our
            website (including booking) may not work correctly. Refer to your browser’s help section for instructions.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Updates
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            We may update this Cookie Policy periodically. Please review this page for changes.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Contact
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.85, color: brandColors.textSecondary }}>
            Questions about cookies or this policy:{' '}
            <Box component="a" href={SITE_EMAIL_HREF} sx={{ color: brandColors.primary }}>
              {SITE_EMAIL}
            </Box>
          </Typography>
        </Box>
      </Container>
    </PublicPageLayout>
  );
}
