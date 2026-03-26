import { Box, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { brandColors } from '../theme';
import BookingSummary from '../components/booking/BookingSummary';
import VehicleCard from '../components/booking/VehicleCard';
import StepIndicator from '../components/common/StepIndicator';
import GradientButton from '../components/common/GradientButton';
import Navbar from '../components/layout/Navbar';
import type { Vehicle } from '../types/booking';

const VEHICLES: Vehicle[] = [
  {
    id: 'nautilus',
    name: 'Lincoln Nautilus',
    description: 'Standard class — spacious for four with generous luggage capacity',
    maxPassengers: 4,
    maxLuggage: 4,
    price: 85,
    image: '/images/main-cars/lincoln_nautilus_front.png',
  },
  {
    id: 'aviator',
    name: 'Lincoln Aviator',
    description: 'Comfort class — refined travel for up to four passengers',
    maxPassengers: 4,
    maxLuggage: 4,
    price: 95,
    image: '/images/main-cars/lincoln_aviator_front.png',
  },
  {
    id: 'escalade',
    name: 'Cadillac Escalade',
    description: 'Premium class — elevated space for groups and VIP road travel',
    maxPassengers: 6,
    maxLuggage: 6,
    price: 150,
    image: '/images/main-cars/cadillac_front.png',
  },
  {
    id: 'suburban',
    name: 'Chevrolet Suburban',
    description: 'Premium class — six-passenger SUV with generous luggage room',
    maxPassengers: 6,
    maxLuggage: 6,
    price: 110,
    image: '/images/main-cars/chevrolet_front.png',
  },
  {
    id: 'yukon',
    name: 'GMC Yukon XL',
    description: 'Premium class — full-size SUV comfort for six passengers',
    maxPassengers: 6,
    maxLuggage: 6,
    price: 120,
    image: '/images/main-cars/gmc_front.png',
  },
];

export default function VehicleSelect() {
  const navigate = useNavigate();
  const { selectedVehicle, setSelectedVehicle, setStep } = useBookingStore();

  const handleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    requestAnimationFrame(() => {
      document.getElementById('continue-btn')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const handleContinue = () => {
    if (!selectedVehicle) return;
    setStep(2);
    navigate('/trip-details');
  };

  const handleBack = () => {
    setStep(0);
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.background }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ pt: { xs: 10, md: 12 }, pb: 8 }}>
        <StepIndicator currentStep={1} />

        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Select Your Vehicle
          </Typography>
          <Typography variant="body1" sx={{ color: brandColors.textSecondary, mb: 6 }}>
            Choose the vehicle class that best suits your needs and preferences.
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <BookingSummary />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                  gap: 3,
                  mb: 4,
                }}
              >
                {VEHICLES.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isSelected={selectedVehicle?.id === vehicle.id}
                    onSelect={handleSelect}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Box
                  component="button"
                  type="button"
                  onClick={handleBack}
                  sx={{
                    background: 'transparent',
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: '8px',
                    color: brandColors.textSecondary,
                    px: 3,
                    py: 1.5,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: brandColors.textMuted, color: '#fff' },
                  }}
                >
                  ← BACK
                </Box>
                <GradientButton
                  id="continue-btn"
                  onClick={handleContinue}
                  disabled={!selectedVehicle}
                  sx={{ px: 5 }}
                >
                  Continue →
                </GradientButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
