import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { brandColors } from '../../theme';

const footerLinks = {
  Services: ['Airport Transfer', 'City Tours', 'Corporate Travel', 'Special Events', 'Hourly Hire'],
  Company: ['About Us', 'Our Fleet', 'Careers', 'Blog', 'Press'],
  Legal: ['Privacy Policy', 'Terms & Conditions', 'Cookie Policy', 'Sitemap'],
};

export default function Footer() {
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
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Box
                component="img"
                src="/images/logo.png"
                alt="Budget Limousine"
                sx={{ height: 52, width: 'auto', objectFit: 'contain', mb: 1 }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: brandColors.textSecondary, mb: 3, lineHeight: 1.8, maxWidth: 320 }}
            >
              Premium limousine service delivering unparalleled comfort and style. 
              Professional chauffeurs, immaculate vehicles, and exceptional service every time.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { icon: <PhoneIcon sx={{ fontSize: 16 }} />, text: '+1 (800) 555-0199' },
                { icon: <EmailIcon sx={{ fontSize: 16 }} />, text: 'info@budgetlimousine.com' },
                { icon: <LocationOnIcon sx={{ fontSize: 16 }} />, text: 'New York, NY 10001' },
              ].map(({ icon, text }) => (
                <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: brandColors.primary }}>{icon}</Box>
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.85rem' }}>
                    {text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={category}>
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
                {category}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {links.map((link) => (
                  <Typography
                    key={link}
                    variant="body2"
                    sx={{
                      color: brandColors.textSecondary,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      '&:hover': { color: brandColors.primary },
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Box>
            </Grid>
          ))}

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
              We Accept
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['VISA', 'MC', 'AMEX', 'PayPal'].map((card) => (
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
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="overline"
                sx={{
                  color: brandColors.textMuted,
                  letterSpacing: '0.15em',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  mb: 1.5,
                  display: 'block',
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['f', 'in', 'tw', 'ig'].map((social) => (
                  <IconButton
                    key={social}
                    size="small"
                    sx={{
                      border: `1px solid ${brandColors.border}`,
                      color: brandColors.textSecondary,
                      width: 34,
                      height: 34,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      '&:hover': {
                        borderColor: brandColors.primary,
                        color: brandColors.primary,
                        background: 'rgba(255,107,0,0.08)',
                      },
                    }}
                  >
                    {social}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: brandColors.textMuted, fontSize: '0.8rem' }}>
            © 2026 Budget Limousine. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.textMuted, fontSize: '0.8rem' }}>
            Designed for excellence in premium transportation.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
