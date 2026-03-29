import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Chip, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FlightIcon from '@mui/icons-material/Flight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import MapIcon from '@mui/icons-material/Map';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { brandColors } from '../theme';
import BookingFormBar from '../components/booking/BookingFormBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import GradientButton from '../components/common/GradientButton';
import {
  DEFAULT_ABOUT_HEADING,
  DEFAULT_ABOUT_PARAGRAPHS,
  SERVICE_ABOUT_BY_SLUG,
} from '../content/homeServiceAbout';

const HERO_STATS = [
  { value: '5K+', label: 'Happy Clients' },
  { value: '15+', label: 'Years Experience' },
  { value: '5', label: 'Luxury Vehicles' },
  { value: '4.9', label: 'Average Rating' },
];

const WHY_CHOOSE_US = [
  {
    icon: <PersonIcon sx={{ fontSize: 28, color: brandColors.primary }} />,
    title: 'Professional Chauffeurs',
    desc: 'All our chauffeurs are licensed, background-checked, and impeccably trained for a premium experience.',
  },
  {
    icon: <WaterDropIcon sx={{ fontSize: 28, color: brandColors.primary }} />,
    title: 'Complimentary Water',
    desc: 'Every ride includes chilled still and sparkling water for your comfort.',
  },
  {
    icon: <EventAvailableIcon sx={{ fontSize: 28, color: brandColors.primary }} />,
    title: '1 Hour Free Waiting',
    desc: 'All vehicles include 1 hour of complimentary waiting time — your schedule, your pace.',
  },
  {
    icon: <FlightIcon sx={{ fontSize: 28, color: brandColors.primary }} />,
    title: 'Airport Flight Tracking',
    desc: 'We monitor your flight in real-time to adjust pickup time automatically at EWR, JFK, LGA, and TEB.',
  },
];

const SERVICES = [
  {
    icon: <FlightIcon sx={{ fontSize: 32, color: brandColors.primary }} />,
    title: 'Airport Transfers',
    desc: 'Reliable drops and pickups at EWR, JFK, LGA & TEB.',
  },
  {
    icon: <BusinessCenterIcon sx={{ fontSize: 32, color: brandColors.primary }} />,
    title: 'Corporate Travel',
    desc: 'Executive transport designed for professionals.',
  },
  {
    icon: <CelebrationIcon sx={{ fontSize: 32, color: brandColors.primary }} />,
    title: 'Special Events',
    desc: 'Make weddings and proms unforgettable.',
  },
  {
    icon: <AccessTimeFilledIcon sx={{ fontSize: 32, color: brandColors.primary }} />,
    title: 'Hourly Chauffeur',
    desc: 'Flexible hourly service at your complete disposal.',
  },
  {
    icon: <MapIcon sx={{ fontSize: 32, color: brandColors.primary }} />,
    title: 'City Tours',
    desc: 'Explore NJ and NYC in absolute luxury.',
  },
  {
    icon: <LocalActivityIcon sx={{ fontSize: 32, color: brandColors.primary }} />,
    title: 'Concerts & Sports',
    desc: 'Premium group transport to major arenas.',
  },
];

const IMAGE_VIEWS = ['main', 'front', 'back'] as const;
type ImageView = typeof IMAGE_VIEWS[number];

const FLEET_CARS = [
  {
    id: 'nautilus',
    name: 'Lincoln Nautilus',
    class: 'Standard Class',
    imagePrefix: '/images/main-cars/lincoln_nautilus',
    passengers: 4,
    luggage: 4,
  },
  {
    id: 'aviator',
    name: 'Lincoln Aviator',
    class: 'Comfort Class',
    imagePrefix: '/images/main-cars/lincoln_aviator',
    passengers: 4,
    luggage: 4,
  },
  {
    id: 'escalade',
    name: 'Cadillac Escalade',
    class: 'Premium Class',
    imagePrefix: '/images/main-cars/cadillac',
    passengers: 6,
    luggage: 6,
  },
  {
    id: 'suburban',
    name: 'Chevrolet Suburban',
    class: 'Premium Class',
    imagePrefix: '/images/main-cars/chevrolet',
    passengers: 6,
    luggage: 6,
  },
  {
    id: 'yukon',
    name: 'GMC Yukon XL',
    class: 'Premium Class',
    imagePrefix: '/images/main-cars/gmc',
    passengers: 6,
    luggage: 6,
  },
] as const;

const NJ_AREAS = [
  'Princeton', 'Marlboro', 'Manalapan', 'Monroe', 'Belmar', 'Red Bank',
  'Montclair', 'Cedar Grove', 'Wayne', 'Verona', 'Oradell', 'Morristown',
  'Madison', 'Short Hills', 'Summit', 'Westfield', 'Bridgewater', 'Ramsey',
  'Mahwah', 'Ridgewood', 'Franklin Lakes', 'Parsippany', 'Denville', 'Dover',
  'Jersey City', 'Fort Lee', 'Sparta',
];

// Fleet card with carousel
function FleetCard({ car }: { car: (typeof FLEET_CARS)[number] }) {
  const [viewIndex, setViewIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fading, setFading] = useState(false);
  const navigate = useNavigate();

  const currentView = IMAGE_VIEWS[viewIndex] as ImageView;
  const currentImage = `${car.imagePrefix}_${currentView}.png`;

  const changeView = (e: React.MouseEvent, dir: 1 | -1) => {
    e.stopPropagation();
    setFading(true);
    setTimeout(() => {
      setViewIndex((p) => (p + dir + IMAGE_VIEWS.length) % IMAGE_VIEWS.length);
      setFading(false);
    }, 150);
  };

  const scrollToBooking = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('booking-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      {/* Image area with carousel */}
      <Box
        sx={{
          height: 200,
          background: 'linear-gradient(135deg, #0D1525 0%, #162035 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={currentImage}
          alt={`${car.name} ${currentView}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.15s ease',
          }}
        />

        {/* Dot indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5,
            zIndex: 2,
          }}
        >
          {IMAGE_VIEWS.map((_, i) => (
            <Box
              key={i}
              sx={{
                width: i === viewIndex ? 16 : 6,
                height: 6,
                borderRadius: '3px',
                backgroundColor: i === viewIndex ? brandColors.primary : 'rgba(255,255,255,0.35)',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </Box>

        {/* Arrows */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 0.5,
            zIndex: 2,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            '@media (hover: none)': { opacity: 1 },
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => changeView(e, -1)}
            sx={{
              backgroundColor: 'rgba(10,14,26,0.7)',
              border: `1px solid ${brandColors.border}`,
              color: '#fff',
              width: 30,
              height: 30,
              backdropFilter: 'blur(8px)',
              '&:hover': { backgroundColor: 'rgba(255,107,0,0.3)', borderColor: brandColors.primary },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => changeView(e, 1)}
            sx={{
              backgroundColor: 'rgba(10,14,26,0.7)',
              border: `1px solid ${brandColors.border}`,
              color: '#fff',
              width: 30,
              height: 30,
              backdropFilter: 'blur(8px)',
              '&:hover': { backgroundColor: 'rgba(255,107,0,0.3)', borderColor: brandColors.primary },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Chip
          label={car.class.toUpperCase()}
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
        <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.82rem', mb: 1 }}>
          Up to {car.passengers} passengers · {car.luggage} luggage
        </Typography>
        <Typography variant="caption" sx={{ color: brandColors.textMuted, fontSize: '0.72rem', display: 'block', mb: 2.5, lineHeight: 1.6 }}>
          1 hour free waiting · Meet &amp; greet · Door-to-door transfer
        </Typography>
        <GradientButton fullWidth onClick={scrollToBooking} sx={{ py: 1.25, fontSize: '0.8rem' }}>
          Book Now
        </GradientButton>
      </Box>
    </Box>
  );
}

// Transparent Animated Cadillac Background Slider for sections below Hero
function ContentBackgroundSlider() {
  const [bgIndex, setBgIndex] = useState(1);
  const totalImages = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev % totalImages) + 1);
    }, 5000); // changes every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {[1, 2, 3].map((num) => (
        <Box
          key={num}
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(/images/cadillac_inside_${num}.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: bgIndex === num ? 0.05 : 0, // Very transparent
            transition: 'opacity 2s ease-in-out', // Smooth transition
          }}
        />
      ))}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, #080C17 0%, transparent 10%, transparent 90%, #080C17 100%)`, // blending edges
        }}
      />
    </Box>
  );
}

export default function HeroPage() {
  const [searchParams] = useSearchParams();
  const serviceSlug = searchParams.get('service');
  const serviceBlock = serviceSlug ? SERVICE_ABOUT_BY_SLUG[serviceSlug] : undefined;
  const serviceScrollGateRef = useRef(true);

  const aboutHeading = serviceBlock?.h3 ?? DEFAULT_ABOUT_HEADING;
  const aboutParagraphs = serviceBlock?.paragraphs ?? DEFAULT_ABOUT_PARAGRAPHS;

  useEffect(() => {
    if (serviceSlug && SERVICE_ABOUT_BY_SLUG[serviceSlug]) {
      document.title = `${SERVICE_ABOUT_BY_SLUG[serviceSlug].title} | Budget Limousine`;
    } else {
      document.title = 'Budget Limousine | A Ride With Class';
    }
  }, [serviceSlug]);

  useEffect(() => {
    const validSlug = serviceSlug && SERVICE_ABOUT_BY_SLUG[serviceSlug];
    if (!validSlug) {
      serviceScrollGateRef.current = false;
      return;
    }

    const scrollToAbout = () => {
      document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (serviceScrollGateRef.current) {
      serviceScrollGateRef.current = false;
      requestAnimationFrame(() => requestAnimationFrame(scrollToAbout));
      return;
    }

    scrollToAbout();
  }, [serviceSlug]);

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
          backgroundColor: '#080C17',
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
              linear-gradient(180deg, rgba(10,14,26,0.75) 0%, rgba(10,14,26,0.65) 50%, #080C17 100%),
              radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.08) 0%, transparent 60%)
            `,
            zIndex: 1,
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pt: { xs: 10, md: 6 } }}>
          <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: '16px !important', color: `${brandColors.primary} !important` }} />}
              label="Budget Limousine - Your Trusted NJ Partner"
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
                Class
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
              Professional chauffeur service for airport transfers, corporate travel, and special occasions across New Jersey — available 24/7.
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
                {' '}rating from verified clients
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

      {/* Content Below Hero - Wrapped in Relative Box for the animated Cadillac background */}
      <Box sx={{ position: 'relative', backgroundColor: '#080C17' }}>
        
        {/* Transparent Cadillac Sliding Background */}
        <ContentBackgroundSlider />

        {/* Note: the inner containers must have zIndex > 0 relative to their parent so they sit above the absolute background */}
        
        {/* Why Choose Us Marquee Slider Section */}
        <Box id="why-choose-us" sx={{ position: 'relative', zIndex: 1, py: 10 }}>
          <Container maxWidth="xl">
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: brandColors.primary,
                letterSpacing: '0.2em',
                mb: 6,
                fontWeight: 600,
              }}
            >
              Why Choose Us
            </Typography>

            {/* Horizontal Services & Features Slider */}
            <Box
              sx={{
                overflow: 'hidden', // hides scrollbar
                width: '100%',
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  width: 'max-content',
                  animation: 'scrollLeft 30s linear infinite',
                  '&:hover': {
                    animationPlayState: 'paused',
                  },
                  '@keyframes scrollLeft': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(calc(-50% - 1.5rem))' }, // scroll half exactly if items are duplicated
                  },
                }}
              >
                {/* Render items twice to create the infinite seamless loop effect */}
                {[...WHY_CHOOSE_US, ...SERVICES, ...WHY_CHOOSE_US, ...SERVICES].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 300,
                      p: 4,
                      backgroundColor: brandColors.card,
                      borderRadius: '16px',
                      border: `1px solid ${brandColors.border}`,
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                      '&:hover': {
                        borderColor: brandColors.primary,
                        transform: 'translateY(-4px)',
                        boxShadow: `0 10px 30px rgba(255,107,0,0.15)`,
                      },
                    }}
                  >
                    <Box sx={{ mb: 2, display: 'inline-flex', p: 1.5, borderRadius: '12px', background: 'rgba(255,107,0,0.08)' }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.05rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.textSecondary, lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* About section */}
        <Box id="about-section" sx={{ position: 'relative', zIndex: 1, pb: 10 }}>
          <Container maxWidth="xl">
            <Box id="about" sx={{ maxWidth: 900, mx: 'auto' }}>
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
                component="h2"
                sx={{ textAlign: 'center', fontWeight: 700, mb: 6, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
              >
                {aboutHeading}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {aboutParagraphs.map((text, i) => (
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
        <Box id="fleet" sx={{ position: 'relative', zIndex: 1, py: 10 }}>
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
              A Ride With Class
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: brandColors.textSecondary, mb: 8, maxWidth: 620, mx: 'auto' }}
            >
              Every vehicle in our fleet is meticulously maintained and equipped for the most comfortable experience — from airport transfers to special occasions.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
                gap: 3,
              }}
            >
              {FLEET_CARS.map((car) => (
                <FleetCard key={car.id} car={car} />
              ))}
            </Box>
          </Container>
        </Box>

        {/* Service Areas Section */}
        <Box sx={{ position: 'relative', zIndex: 1, py: 10 }}>
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
              Service Areas
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{ textAlign: 'center', fontWeight: 700, mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
            >
              Serving All of New Jersey &amp; Triad-States
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: brandColors.textSecondary, mb: 4, maxWidth: 680, mx: 'auto' }}
            >
              From the Hudson River waterfront to the serene suburbs — we provide luxury chauffeured service throughout New Jersey, with dependable Triad-States coverage (New York, Pennsylvania, Connecticut, and Delaware) for regional transfers and special requests.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1.25,
                mb: 6,
              }}
            >
              {['Pennsylvania', 'New York', 'Connecticut', 'Delaware'].map((state) => (
                <Chip
                  key={state}
                  label={state}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,107,0,0.1)',
                    border: `1px solid rgba(255,107,0,0.25)`,
                    color: brandColors.textSecondary,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>

            {/* Airport coverage */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
                mb: 6,
              }}
            >
              {[
                { code: 'EWR', name: 'Newark Liberty' },
                { code: 'JFK', name: 'John F. Kennedy' },
                { code: 'LGA', name: 'LaGuardia' },
                { code: 'TEB', name: 'Teterboro' },
              ].map((airport) => (
                <Box
                  key={airport.code}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 3,
                    py: 1.5,
                    backgroundColor: brandColors.card,
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: '12px',
                  }}
                >
                  <FlightIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {airport.code}
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.textMuted, fontSize: '0.72rem' }}>
                      {airport.name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* NJ cities grid */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1.25,
              }}
            >
              {NJ_AREAS.map((area) => (
                <Box
                  key={area}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 2,
                    py: 0.75,
                    backgroundColor: 'rgba(255,107,0,0.06)',
                    border: `1px solid rgba(255,107,0,0.15)`,
                    borderRadius: '8px',
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 13, color: brandColors.primary }} />
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.8rem', fontWeight: 500 }}>
                    {area}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <GradientButton
                onClick={scrollToBooking}
                sx={{ px: 6, py: 1.75, fontSize: '0.95rem' }}
              >
                Book Your Ride Now
              </GradientButton>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
