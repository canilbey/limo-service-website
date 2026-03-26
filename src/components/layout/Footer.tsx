import { Box, Container, Typography, Grid, Divider, Link as MuiLink } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { brandColors } from '../../theme';
import {
  SITE_EMAIL,
  SITE_EMAIL_HREF,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
  SITE_PHONE_LABEL,
  FOOTER_SERVICE_LINKS,
} from '../../constants/site';

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
  { label: 'Sitemap', to: '/sitemap' },
] as const;

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToFleet = () => {
    if (location.pathname === '/') {
      document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' }), 350);
    }
  };

  return (
    <Box
      id="contact"
      component="footer"
      sx={{
        backgroundColor: '#080C17',
        borderTop: `1px solid ${brandColors.border}`,
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ mb: 3 }}>
              <Box
                component="img"
                src="/images/logo.png"
                alt="Budget Limousine"
                sx={{ height: 120, width: 'auto', maxWidth: '100%', objectFit: 'contain', mb: 1 }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: brandColors.textSecondary, mb: 3, lineHeight: 1.8, maxWidth: 380 }}
            >
              Budget Limousine — A ride with class. New Jersey&apos;s premier luxury chauffeur service delivering professional drivers, pristine vehicles, and exceptional service for airport transfers, corporate travel, and special events.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Box sx={{ color: brandColors.primary }}>
                  <PhoneIcon sx={{ fontSize: 16 }} />
                </Box>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.85rem' }}>
                  {SITE_PHONE_LABEL}
                  {' · '}
                  <MuiLink href={SITE_PHONE_HREF} sx={{ color: brandColors.primary, textDecoration: 'none', fontWeight: 600 }}>
                    {SITE_PHONE_DISPLAY}
                  </MuiLink>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: brandColors.primary }}>
                  <EmailIcon sx={{ fontSize: 16 }} />
                </Box>
                <MuiLink href={SITE_EMAIL_HREF} sx={{ color: brandColors.textSecondary, fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: brandColors.primary } }}>
                  {SITE_EMAIL}
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography
              variant="overline"
              sx={{
                color: brandColors.textMuted,
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
                fontWeight: 600,
                mb: 2,
                display: 'block',
              }}
            >
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {FOOTER_SERVICE_LINKS.map(({ label, slug }) => (
                <Typography key={slug} variant="body2" sx={{ fontSize: '0.85rem' }}>
                  <Link
                    to={`/?service=${slug}`}
                    style={{
                      color: brandColors.textSecondary,
                      textDecoration: 'none',
                    }}
                  >
                    {label}
                  </Link>
                </Typography>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography
              variant="overline"
              sx={{
                color: brandColors.textMuted,
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
                fontWeight: 600,
                mb: 2,
                display: 'block',
              }}
            >
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                <Link to="/about" style={{ color: brandColors.textSecondary, textDecoration: 'none' }}>
                  About Us
                </Link>
              </Typography>
              <Box
                component="button"
                type="button"
                onClick={scrollToFleet}
                sx={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: brandColors.textSecondary,
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  '&:hover': { color: brandColors.primary },
                }}
              >
                Our Fleet
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <Typography
              variant="overline"
              sx={{
                color: brandColors.textMuted,
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
                fontWeight: 600,
                mb: 2,
                display: 'block',
              }}
            >
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {legalLinks.map(({ label, to }) => (
                <Typography key={to} variant="body2" sx={{ fontSize: '0.85rem' }}>
                  <Link to={to} style={{ color: brandColors.textSecondary, textDecoration: 'none' }}>
                    {label}
                  </Link>
                </Typography>
              ))}
            </Box>
            <Typography
              variant="overline"
              sx={{
                color: brandColors.textMuted,
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
                fontWeight: 600,
                mb: 1.5,
                mt: 3,
                display: 'block',
              }}
            >
              We Accept
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['VISA', 'MC', 'AMEX', 'Discover'].map((card) => (
                <Box
                  key={card}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: '6px',
                    backgroundColor: brandColors.cardElevated,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                    {card}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: brandColors.textMuted, fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Budget Limousine. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.textMuted, fontSize: '0.8rem' }}>
            A Ride With Class.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
