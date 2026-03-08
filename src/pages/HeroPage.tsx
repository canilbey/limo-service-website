import { Box, Container, Typography, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import { brandColors } from '../theme';
import BookingFormBar from '../components/booking/BookingFormBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const HERO_STATS = [
  { value: '10K+', label: 'Happy Clients' },
  { value: '15+', label: 'Years Experience' },
  { value: '50+', label: 'Luxury Vehicles' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function HeroPage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.background }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient layers */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(255,184,0,0.06) 0%, transparent 50%),
              linear-gradient(180deg, ${brandColors.background} 0%, #0D1525 50%, ${brandColors.background} 100%)
            `,
            zIndex: 0,
          }}
        />

        {/* Decorative car silhouette */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: '-20%', md: '-5%' },
            bottom: '10%',
            width: { xs: '80%', md: '55%' },
            height: '70%',
            opacity: { xs: 0.04, md: 0.07 },
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'%3E%3Cpath fill='%23ffffff' d='M180 50 L175 35 L160 25 L140 20 L100 18 L70 20 L50 30 L30 40 L20 50 L15 55 L180 55 Z M45 55 C45 62 39 67 32 67 C25 67 19 62 19 55 C19 48 25 43 32 43 C39 43 45 48 45 55 Z M170 55 C170 62 164 67 157 67 C150 67 144 62 144 55 C144 48 150 43 157 43 C164 43 170 48 170 55 Z'/%3E%3C/svg%3E") center/contain no-repeat`,
            zIndex: 0,
          }}
        />

        {/* Animated glow orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
            zIndex: 0,
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
              '50%': { transform: 'scale(1.2)', opacity: 1 },
            },
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: { xs: 10, md: 6 } }}>
          <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
            {/* Badge */}
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: '16px !important', color: `${brandColors.primary} !important` }} />}
              label="Premium Limousine Service Since 2009"
              sx={{
                mb: 4,
                backgroundColor: 'rgba(255,107,0,0.1)',
                border: `1px solid rgba(255,107,0,0.3)`,
                color: brandColors.textSecondary,
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 3,
                background: 'linear-gradient(180deg, #FFFFFF 0%, #B0BEC5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              A Ride With
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: brandColors.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Class & Comfort
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: brandColors.textSecondary,
                fontWeight: 400,
                mb: 6,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.15rem' },
              }}
            >
              Professional chauffeur service for airport transfers, corporate travel, 
              and special occasions. Experience luxury redefined.
            </Typography>

            {/* Rating row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 6,
              }}
            >
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} sx={{ color: brandColors.secondary, fontSize: 20 }} />
              ))}
              <Typography variant="body2" sx={{ color: brandColors.textSecondary, ml: 1, fontSize: '0.9rem' }}>
                <Box component="span" sx={{ color: '#fff', fontWeight: 700 }}>4.9</Box>
                {' '}rating from 2,400+ verified reviews
              </Typography>
            </Box>

            {/* Booking Form */}
            <BookingFormBar />

            {/* Stats */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 3, md: 6 },
                mt: 6,
                flexWrap: 'wrap',
              }}
            >
              {HERO_STATS.map(({ value, label }) => (
                <Box key={label} sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      background: brandColors.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: { xs: '1.5rem', md: '2rem' },
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.textMuted, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, backgroundColor: '#080C17' }}>
        <Container maxWidth="xl">
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: brandColors.primary,
              letterSpacing: '0.2em',
              mb: 2,
              fontWeight: 600,
            }}
          >
            Why Choose Us
          </Typography>
          <Typography
            variant="h3"
            sx={{ textAlign: 'center', fontWeight: 700, mb: 8, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            The Premium Experience
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {[
              {
                icon: '🎩',
                title: 'First Class Chauffeurs',
                desc: 'All our professional drivers are licensed, background-checked, and impeccably trained.',
              },
              {
                icon: '💧',
                title: 'Complimentary Water',
                desc: 'Every ride includes chilled still and sparkling water for your comfort.',
              },
              {
                icon: '⏰',
                title: 'Free 2-Hour Cancellation',
                desc: 'Cancel up to 2 hours before your pickup with zero charges.',
              },
              {
                icon: '✈️',
                title: 'Flight Tracking',
                desc: 'We monitor your flight in real-time to adjust pickup time automatically.',
              },
            ].map(({ icon, title, desc }) => (
              <Box
                key={title}
                sx={{
                  p: 4,
                  backgroundColor: brandColors.card,
                  borderRadius: '16px',
                  border: `1px solid ${brandColors.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: brandColors.primary,
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 40px rgba(255,107,0,0.1)`,
                  },
                }}
              >
                <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>{icon}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, lineHeight: 1.7 }}>
                  {desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
