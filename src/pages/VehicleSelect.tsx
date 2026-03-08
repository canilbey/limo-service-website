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
    id: 'business',
    name: 'Business Class',
    description: 'Executive sedan for business and airport transfers',
    maxPassengers: 3,
    maxLuggage: 2,
    price: 85,
    image: '',
  },
  {
    id: 'van',
    name: 'Van Class',
    description: 'Spacious luxury van for groups and families',
    maxPassengers: 6,
    maxLuggage: 5,
    price: 120,
    image: '',
  },
  {
    id: 'first',
    name: 'First Class',
    description: 'Ultra-premium vehicle for the most discerning clients',
    maxPassengers: 3,
    maxLuggage: 2,
    price: 150,
    image: '',
  },
];

export default function VehicleSelect() {
  const navigate = useNavigate();
  const { selectedVehicle, setSelectedVehicle, setStep } = useBookingStore();

  const handleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
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
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
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
