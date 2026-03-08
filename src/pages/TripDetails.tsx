import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs, { type Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import BadgeIcon from '@mui/icons-material/Badge';
import FlightIcon from '@mui/icons-material/Flight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { tripDetailsSchema, type TripDetailsSchema } from '../validation/schemas';
import { useBookingStore } from '../store/bookingStore';
import { brandColors } from '../theme';
import BookingSummary from '../components/booking/BookingSummary';
import ExtrasSelector from '../components/booking/ExtrasSelector';
import { pickerPopperSx } from '../components/booking/BookingFormBar';
import StepIndicator from '../components/common/StepIndicator';
import GradientButton from '../components/common/GradientButton';
import Navbar from '../components/layout/Navbar';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: brandColors.border },
    '&:hover fieldset': { borderColor: brandColors.textMuted },
    '&.Mui-focused fieldset': { borderColor: brandColors.primary, borderWidth: '2px' },
  },
  '& .MuiInputLabel-root': { color: brandColors.textMuted },
  '& .MuiInputLabel-root.Mui-focused': { color: brandColors.primary },
  '& .MuiInputBase-input': { color: '#fff' },
};

export default function TripDetails() {
  const navigate = useNavigate();
  const { setTripDetails, setStep } = useBookingStore();
  const [meetingTimePickerOpen, setMeetingTimePickerOpen] = useState(false);
  const [extras, setExtras] = useState({
    infantSeat: 0,
    childSeat: 0,
    boosterSeat: 0,
    extraWaiting: 0,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TripDetailsSchema>({
    resolver: zodResolver(tripDetailsSchema),
    defaultValues: {
      bookingFor: 'myself',
      pickupSign: '',
      flightNumber: '',
      meetingTime: '',
      driverNotes: '',
      extras: {
        infantSeat: 0,
        childSeat: 0,
        boosterSeat: 0,
        extraWaiting: 0,
      },
    },
  });

  const onSubmit = (data: TripDetailsSchema) => {
    setTripDetails({ ...data, extras });
    setStep(3);
    navigate('/confirmation');
  };

  const handleBack = () => {
    setStep(1);
    navigate('/select-vehicle');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.background }}>
        <Navbar />

        <Container maxWidth="xl" sx={{ pt: { xs: 10, md: 12 }, pb: 8 }}>
          <StepIndicator currentStep={2} />

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}
            >
              Trip Details
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.textSecondary, mb: 6 }}>
              Provide additional information to help us serve you better.
            </Typography>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <BookingSummary />
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  {/* Booking for */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: brandColors.card,
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: '16px',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>
                    Who is this booking for?
                  </Typography>
                  <Controller
                    name="bookingFor"
                    control={control}
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup {...field} row sx={{ gap: 2 }}>
                          <FormControlLabel
                            value="myself"
                            control={
                              <Radio
                                sx={{
                                  color: brandColors.border,
                                  '&.Mui-checked': { color: brandColors.primary },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Book for myself
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            value="someone_else"
                            control={
                              <Radio
                                sx={{
                                  color: brandColors.border,
                                  '&.Mui-checked': { color: brandColors.primary },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Book for someone else
                              </Typography>
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Box>

                {/* Trip information */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: brandColors.card,
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: '16px',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
                    Trip Information
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="pickupSign"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Pickup Sign (Name on board)"
                            fullWidth
                            required
                            error={!!errors.pickupSign}
                            helperText={errors.pickupSign?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BadgeIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={inputSx}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="flightNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Flight Number (optional)"
                            fullWidth
                            placeholder="e.g. LH 400"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FlightIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={inputSx}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="meetingTime"
                        control={control}
                        render={({ field: { value, onChange, ...rest } }) => (
                          <TimePicker
                            label="Preferred Meeting Time (optional)"
                            value={value ? dayjs(`1970-01-01T${value}`) : null}
                            onChange={(newVal: Dayjs | null) => onChange(newVal ? newVal.format('HH:mm') : '')}
                            views={['hours', 'minutes']}
                            viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
                            open={meetingTimePickerOpen}
                            onOpen={() => setMeetingTimePickerOpen(true)}
                            onClose={() => setMeetingTimePickerOpen(false)}
                            slots={{ openPickerButton: () => null }}
                            slotProps={{
                              textField: {
                                ...rest,
                                fullWidth: true,
                                InputProps: {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AccessTimeIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                                    </InputAdornment>
                                  ),
                                },
                                onClick: () => setMeetingTimePickerOpen(true),
                                readOnly: true,
                                sx: inputSx,
                              },
                              popper: { sx: pickerPopperSx },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="driverNotes"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Notes for Driver (optional)"
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Special requests, instructions, or preferences..."
                            sx={inputSx}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Extras */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: brandColors.card,
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: '16px',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Extras
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 3, fontSize: '0.85rem' }}>
                    Add child seats or extra waiting time to your booking.
                  </Typography>
                  <ExtrasSelector value={extras} onChange={setExtras} />
                </Box>

                <Divider />

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
                  <GradientButton type="submit" sx={{ px: 5 }}>
                    Continue →
                  </GradientButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
