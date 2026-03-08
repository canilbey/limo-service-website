import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import { useNavigate } from 'react-router-dom';
import { bookingFormSchema, type BookingFormSchema } from '../../validation/schemas';
import { useBookingStore } from '../../store/bookingStore';
import { brandColors } from '../../theme';
import GradientButton from '../common/GradientButton';
import type { TripType } from '../../types/booking';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(10,14,26,0.7)',
    '& fieldset': { borderColor: brandColors.border },
    '&:hover fieldset': { borderColor: brandColors.textMuted },
    '&.Mui-focused fieldset': { borderColor: brandColors.primary, borderWidth: '2px' },
  },
  '& .MuiInputLabel-root': { color: brandColors.textMuted },
  '& .MuiInputLabel-root.Mui-focused': { color: brandColors.primary },
  '& .MuiInputBase-input': { color: '#fff' },
};

export default function BookingFormBar() {
  const [tripType, setTripType] = useState<TripType>('trip');
  const { setBookingForm, setStep } = useBookingStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      tripType: 'trip',
      pickup: '',
      destination: '',
      date: '',
      time: '',
      hours: 2,
    },
  });

  const onSubmit = (data: BookingFormSchema) => {
    setBookingForm({ ...data, tripType });
    setStep(1);
    navigate('/select-vehicle');
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(17, 24, 39, 0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: { xs: '16px', md: '20px' },
        border: `1px solid ${brandColors.border}`,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        width: '100%',
      }}
    >
      <Tabs
        value={tripType}
        onChange={(_, val) => setTripType(val)}
        sx={{
          borderBottom: `1px solid ${brandColors.border}`,
          px: 2,
          '& .MuiTab-root': {
            color: brandColors.textMuted,
            py: 2,
            minWidth: 120,
            '&.Mui-selected': { color: brandColors.primary },
          },
        }}
      >
        <Tab value="trip" label="Transfer" />
        <Tab value="hourly" label="Hourly" />
      </Tabs>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ p: { xs: 2, sm: 3 } }}
      >
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, md: tripType === 'trip' ? 3 : 4 }}>
            <Controller
              name="pickup"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pickup Location"
                  placeholder="Enter pickup address"
                  fullWidth
                  size={isMobile ? 'medium' : 'medium'}
                  error={!!errors.pickup}
                  helperText={errors.pickup?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              )}
            />
          </Grid>

          {tripType === 'trip' ? (
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="destination"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Destination"
                    placeholder="Enter destination"
                    fullWidth
                    error={!!errors.destination}
                    helperText={errors.destination?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FlightLandIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
          ) : (
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="hours"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Duration (hours)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 1, max: 24 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimerIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6, md: tripType === 'trip' ? 2 : 2 }}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date"
                  type="date"
                  fullWidth
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    inputProps: { min: new Date().toISOString().split('T')[0] },
                  }}
                  sx={inputSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: tripType === 'trip' ? 2 : 2 }}>
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Time"
                  type="time"
                  fullWidth
                  error={!!errors.time}
                  helperText={errors.time?.message}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <GradientButton type="submit" fullWidth sx={{ height: '56px' }}>
              Book Now
            </GradientButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
