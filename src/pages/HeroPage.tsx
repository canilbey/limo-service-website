import { Box, Container, Typography, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FlightIcon from '@mui/icons-material/Flight';
import { useNavigate } from 'react-router-dom';
import { brandColors } from '../theme';
import BookingFormBar from '../components/booking/BookingFormBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import GradientButton from '../components/common/GradientButton';

const HERO_STATS = [
  { value: '10K+', label: 'Happy Clients' },
  { value: '15+', label: 'Years Experience' },
  { value: '50+', label: 'Luxury Vehicles' },
  { value: '4.9', label: 'Average Rating' },
];

const WHY_CHOOSE_US = [
  {
    icon: <PersonIcon sx={{ fontSize: 28, color: brandColors.primary }} />,
    title: 'First Class Chauffeurs',
    desc: 'All our professional drivers are licensed, background-checked, and impeccably trained.',
  },
  {
    icon: <WaterDropIcon sx={{ fontSize: 28, color: brandColors.primary }} />,
    title: 'Complimentary Water',
    desc: 'Every ride includes chilled still and sparkling water for your comfort.',
  },
  {
    icon: <EventAvailableIcon sx={{ fontSize: 28, color: brandColors.primary }} />,
    title: 'Free 2-Hour Cancellation',
    desc: 'Cancel up to 2 hours before your pickup with zero charges.',
  },
  {
    icon: <FlightIcon sx={{ fontSize: 28, color: brandColors.primary }} />,
    title: 'Flight Tracking',
    desc: 'We monitor your flight in real-time to adjust pickup time automatically.',
  },
];

const FLEET_CARS = [
  {
    name: 'Lincoln Navigator',
    class: 'Business Class',
    price: 85,
    image: '/images/main-cars/lincoln_main.png',
    passengers: 3,
  },
  {
    name: 'Chevrolet Suburban',
    class: 'Standard Class',
    price: 95,
    image: '/images/main-cars/chevrolet_main.png',
    passengers: 6,
  },
  {
    name: 'GMC Yukon',
    class: 'Van Class',
    price: 120,
    image: '/images/main-cars/gmc_main.png',
    passengers: 6,
  },
  {
    name: 'Cadillac Escalade',
    class: 'First Class',
    price: 150,
    image: '/images/main-cars/cadillac_main.png',
    passengers: 3,
  },
];

const ABOUT_PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
];

export default function HeroPage() {
  const navigate = useNavigate();

  const scrollToBooking = () => {
    const el = document.getElementById('booking-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
        {/* Hero background image */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/hero_section.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />

        {/* Dark overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(10,14,26,0.75) 0%, rgba(10,14,26,0.65) 50%, rgba(10,14,26,0.85) 100%),
              radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.08) 0%, transparent 60%)
            `,
            zIndex: 1,
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pt: { xs: 10, md: 6 } }}>
          <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
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
            <Box id="booking-form">
              <BookingFormBar />
            </Box>

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

      {/* Why Choose Us Section */}
      <Box id="why-choose-us" sx={{ py: 10, backgroundColor: '#080C17' }}>
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
            {WHY_CHOOSE_US.map(({ icon, title, desc }) => (
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
                <Box sx={{ mb: 2 }}>{icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, lineHeight: 1.7 }}>
                  {desc}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* About paragraphs */}
          <Box id="about" sx={{ mt: 10, maxWidth: 900, mx: 'auto' }}>
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
              About Us
            </Typography>
            <Typography
              variant="h3"
              sx={{ textAlign: 'center', fontWeight: 700, mb: 6, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
            >
              Our Story
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {ABOUT_PARAGRAPHS.map((text, i) => (
                <Typography
                  key={i}
                  variant="body1"
                  sx={{
                    color: brandColors.textSecondary,
                    lineHeight: 1.9,
                    fontSize: '1rem',
                    textAlign: { xs: 'left', md: 'justify' },
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Fleet Section */}
      <Box id="fleet" sx={{ py: 10, backgroundColor: brandColors.background }}>
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
            Our Fleet
          </Typography>
          <Typography
            variant="h3"
            sx={{ textAlign: 'center', fontWeight: 700, mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Choose Your Vehicle
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', color: brandColors.textSecondary, mb: 8, maxWidth: 560, mx: 'auto' }}
          >
            Every vehicle in our fleet is meticulously maintained and equipped for the most comfortable experience.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {FLEET_CARS.map((car) => (
              <Box
                key={car.name}
                sx={{
                  backgroundColor: brandColors.card,
                  borderRadius: '20px',
                  border: `1px solid ${brandColors.border}`,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: brandColors.primary,
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 50px rgba(255,107,0,0.12)',
                  },
                }}
              >
                {/* Vehicle image */}
                <Box
                  sx={{
                    height: 200,
                    background: 'linear-gradient(135deg, #0D1525 0%, #162035 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src={car.image}
                    alt={car.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                </Box>

                <Box sx={{ p: 3 }}>
                  <Chip
                    label={car.class}
                    size="small"
                    sx={{
                      mb: 1.5,
                      backgroundColor: 'rgba(255,107,0,0.12)',
                      border: `1px solid rgba(255,107,0,0.25)`,
                      color: brandColors.primary,
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      letterSpacing: '0.08em',
                      height: 22,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.75 }}>
                    {car.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                    <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.82rem' }}>
                      Up to {car.passengers} passengers
                    </Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: brandColors.textMuted, display: 'block', fontSize: '0.6rem' }}>
                        FROM
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          background: brandColors.gradient,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          lineHeight: 1.1,
                          fontSize: '1.1rem',
                        }}
                      >
                        ${car.price}
                      </Typography>
                    </Box>
                  </Box>

                  <GradientButton
                    fullWidth
                    onClick={() => {
                      navigate('/');
                      scrollToBooking();
                    }}
                    sx={{ py: 1.25, fontSize: '0.8rem' }}
                  >
                    Book Now
                  </GradientButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
