import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderMultiSectionDigitalClockTimeView } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs, { type Dayjs } from 'dayjs';
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
import PlacesAutocomplete from '../maps/PlacesAutocomplete';
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

export const pickerPopperSx = {
  '& .MuiPaper-root': {
    backgroundColor: '#111827',
    border: '1px solid #1E2D45',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
  },
  '& .MuiPickersDay-root': {
    color: '#B0BEC5',
    '&:hover': { backgroundColor: 'rgba(255,107,0,0.15)', color: '#fff' },
    '&.Mui-selected': { background: 'linear-gradient(135deg, #FF6B00, #FFB800)', color: '#fff' },
    '&.MuiPickersDay-today': { borderColor: '#FF6B00' },
  },
  '& .MuiPickersCalendarHeader-root': { color: '#fff' },
  '& .MuiDayCalendar-weekDayLabel': { color: '#6B7A8D' },
  '& .MuiPickersArrowSwitcher-button': { color: '#B0BEC5' },
  '& .MuiMultiSectionDigitalClock-root': {
    backgroundColor: '#111827',
    '& .MuiMenuItem-root': {
      color: '#B0BEC5',
      '&.Mui-selected': { background: 'linear-gradient(135deg, #FF6B00, #FFB800)', color: '#fff' },
    },
  },
  '& .MuiTimeClock-root': { color: '#B0BEC5' },
  '& .MuiClock-root': { backgroundColor: 'transparent' },
  '& .MuiClockNumber-root': { color: '#B0BEC5', '&.Mui-selected': { color: '#fff' } },
  '& .MuiClockPointer-root': { '& .MuiClockPointer-thumb': { backgroundColor: '#FF6B00', borderColor: '#FF6B00' } },
  '& .MuiDialogActions-root button': { color: '#FF6B00' },
};

export default function BookingFormBar() {
  const [tripType, setTripType] = useState<TripType>('trip');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const { setBookingForm, setStep } = useBookingStore();
  const navigate = useNavigate();

  /** Recomputed each render so the 6-hour window stays current while the form is open */
  const minBookingDateTime = dayjs().add(6, 'hour');

  const {
    control,
    handleSubmit,
    setValue,
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
      pickupCoords: undefined,
      destinationCoords: undefined,
    },
  });

  const watchedDate = useWatch({ control, name: 'date' });
  const selectedDay = watchedDate ? dayjs(watchedDate) : null;
  const restrictTimeToMinBooking =
    !!selectedDay && selectedDay.isSame(minBookingDateTime, 'day');

  const onSubmit = (data: BookingFormSchema) => {
    setBookingForm({ ...data, tripType });
    setStep(1);
    navigate('/select-vehicle');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          onChange={(_, val) => {
            setTripType(val);
            if (val === 'hourly') {
              setValue('destination', '');
              setValue('destinationCoords', undefined);
            }
          }}
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
                  <PlacesAutocomplete
                    label="Pickup Location"
                    placeholder="Enter pickup address"
                    value={field.value}
                    onChange={field.onChange}
                    onPlaceResolved={(place) =>
                      setValue(
                        'pickupCoords',
                        place ? { lat: place.lat, lng: place.lng } : undefined,
                      )
                    }
                    error={!!errors.pickup}
                    helperText={errors.pickup?.message}
                    icon={
                      <LocationOnIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
                    }
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
                    <PlacesAutocomplete
                      label="Destination"
                      placeholder="Enter destination"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onPlaceResolved={(place) =>
                        setValue(
                          'destinationCoords',
                          place ? { lat: place.lat, lng: place.lng } : undefined,
                        )
                      }
                      error={!!errors.destination}
                      helperText={errors.destination?.message}
                      icon={
                        <FlightLandIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
                      }
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
                render={({ field: { value, onChange, ...rest } }) => (
                  <DatePicker
                    label="Date"
                    value={value ? dayjs(value) : null}
                    onChange={(newVal: Dayjs | null) => onChange(newVal ? newVal.format('YYYY-MM-DD') : '')}
                    minDate={minBookingDateTime.startOf('day')}
                    open={datePickerOpen}
                    onOpen={() => setDatePickerOpen(true)}
                    onClose={() => setDatePickerOpen(false)}
                    slots={{ openPickerButton: () => null }}
                    slotProps={{
                      textField: {
                        ...rest,
                        fullWidth: true,
                        error: !!errors.date,
                        helperText: errors.date?.message,
                        onClick: () => setDatePickerOpen(true),
                        readOnly: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        },
                        sx: inputSx,
                      },
                      popper: { sx: pickerPopperSx },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: tripType === 'trip' ? 2 : 2 }}>
              <Controller
                name="time"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <TimePicker
                    label="Time"
                    value={value ? dayjs(`1970-01-01T${value}`) : null}
                    onChange={(newVal: Dayjs | null) => onChange(newVal ? newVal.format('HH:mm') : '')}
                    minTime={restrictTimeToMinBooking ? minBookingDateTime : undefined}
                    views={['hours', 'minutes']}
                    viewRenderers={{ hours: renderMultiSectionDigitalClockTimeView, minutes: renderMultiSectionDigitalClockTimeView }}
                    open={timePickerOpen}
                    onOpen={() => setTimePickerOpen(true)}
                    onClose={() => setTimePickerOpen(false)}
                    slots={{ openPickerButton: () => null }}
                    slotProps={{
                      textField: {
                        ...rest,
                        fullWidth: true,
                        error: !!errors.time,
                        helperText: errors.time?.message,
                        onClick: () => setTimePickerOpen(true),
                        readOnly: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        },
                        sx: inputSx,
                      },
                      popper: { sx: pickerPopperSx },
                    }}
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
    </LocalizationProvider>
  );
}
