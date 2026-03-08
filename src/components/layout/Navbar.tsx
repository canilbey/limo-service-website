import { AppBar, Toolbar, Box, Typography, Button, Container, useScrollTrigger } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { brandColors } from '../../theme';

export default function Navbar() {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 10 });

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: brandColors.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DirectionsCarIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.1,
                  fontSize: '1.1rem',
                  letterSpacing: '0.02em',
                }}
              >
                BUDGET LIMOUSINE
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: brandColors.primary,
                  letterSpacing: '0.15em',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                }}
              >
                A RIDE WITH CLASS
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {['Services', 'Fleet', 'About', 'Contact'].map((item) => (
              <Button
                key={item}
                sx={{
                  color: brandColors.textSecondary,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  '&:hover': { color: '#fff' },
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 0.75,
                color: brandColors.textSecondary,
              }}
            >
              <PhoneIcon sx={{ fontSize: 16, color: brandColors.primary }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                +1 (800) 555-0199
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
