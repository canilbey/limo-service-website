import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { confirmationSchema, type ConfirmationSchema } from '../validation/schemas';
import { useBookingStore } from '../store/bookingStore';
import { brandColors } from '../theme';
import BookingSummary from '../components/booking/BookingSummary';
import StepIndicator from '../components/common/StepIndicator';
import GradientButton from '../components/common/GradientButton';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: brandColors.border },
    '&:hover fieldset': { borderColor: brandColors.textMuted },
    '&.Mui-focused fieldset': { borderColor: brandColors.primary, borderWidth: '2px' },
  },
  '& .MuiInputLabel-root': { color: brandColors.textMuted },
  '& .MuiInputLabel-root.Mui-focused': { color: brandColors.primary },
  '& .MuiInputBase-input': { color: '#fff' },
  '& .MuiSelect-icon': { color: brandColors.textMuted },
};

export default function Confirmation() {
  const navigate = useNavigate();
  const { setConfirmation, setStep, bookingForm, selectedVehicle } = useBookingStore();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmationSchema>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      title: 'Mr',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      privacyPolicy: false,
      termsConditions: false,
    },
  });

  const onSubmit = (data: ConfirmationSchema) => {
    if (phone.length < 7) {
      setPhoneError('Please enter a valid phone number');
      return;
    }
    setPhoneError('');
    setConfirmation({
      title: data.title,
      firstName: data.firstName,
      lastName: data.lastName,
      phone,
      email: data.email,
      password: data.password,
      privacyPolicy: true,
      termsConditions: true,
    });
    setStep(4);
    setIsSubmitted(true);
  };

  const handleBack = () => {
    setStep(2);
    navigate('/trip-details');
  };

  if (isSubmitted) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.background }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ pt: 20, pb: 8, textAlign: 'center' }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: brandColors.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
              boxShadow: '0 20px 50px rgba(255,107,0,0.3)',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 56, color: '#fff' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Booking Confirmed!
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: brandColors.textSecondary, mb: 2, lineHeight: 1.8 }}
          >
            Thank you for choosing Budget Limousine. Your reservation has been successfully created.
            A confirmation email has been sent to your inbox.
          </Typography>
          <Box
            sx={{
              p: 3,
              backgroundColor: brandColors.card,
              border: `1px solid ${brandColors.border}`,
              borderRadius: '16px',
              mb: 4,
              textAlign: 'left',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: brandColors.textMuted, mb: 2, letterSpacing: '0.1em', fontSize: '0.75rem' }}>
              BOOKING REFERENCE
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: brandColors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '0.15em',
              }}
            >
              BL-{Math.random().toString(36).substring(2, 8).toUpperCase()}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                Vehicle
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedVehicle?.name || '—'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                Pickup
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {bookingForm?.pickup || '—'}
              </Typography>
            </Box>
          </Box>
          <GradientButton fullWidth onClick={() => navigate('/')} sx={{ py: 2 }}>
            Back to Home
          </GradientButton>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.background }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ pt: { xs: 10, md: 12 }, pb: 8 }}>
        <StepIndicator currentStep={3} />

        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Create Your Account
          </Typography>
          <Typography variant="body1" sx={{ color: brandColors.textSecondary, mb: 6 }}>
            Complete your reservation by creating a Budget Limousine account.
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
                {/* Personal Information */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: brandColors.card,
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: '16px',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <PersonIcon sx={{ color: brandColors.primary }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Personal Information
                    </Typography>
                  </Box>

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth sx={inputSx}>
                            <InputLabel>Title</InputLabel>
                            <Select {...field} label="Title">
                              {['Mr', 'Mrs', 'Ms', 'Dr'].map((t) => (
                                <MenuItem key={t} value={t}>
                                  {t}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4.5 }}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name"
                            fullWidth
                            required
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            sx={inputSx}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4.5 }}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name"
                            fullWidth
                            required
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            sx={inputSx}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <PhoneInput
                          country="us"
                          value={phone}
                          onChange={(val) => {
                            setPhone(val);
                            if (phoneError) setPhoneError('');
                          }}
                          inputStyle={{
                            width: '100%',
                            backgroundColor: 'transparent',
                            border: `1px solid ${phoneError ? '#f44336' : brandColors.border}`,
                            borderRadius: '12px',
                            color: '#fff',
                            height: '56px',
                            fontSize: '1rem',
                            paddingLeft: '58px',
                          }}
                          buttonStyle={{
                            backgroundColor: brandColors.cardElevated,
                            border: `1px solid ${brandColors.border}`,
                            borderRight: 'none',
                            borderRadius: '12px 0 0 12px',
                          }}
                          dropdownStyle={{
                            backgroundColor: brandColors.card,
                            color: '#fff',
                            border: `1px solid ${brandColors.border}`,
                          }}
                          containerStyle={{ width: '100%' }}
                          specialLabel="Phone Number *"
                        />
                        {phoneError && (
                          <Typography
                            variant="caption"
                            sx={{ color: '#f44336', mt: 0.5, ml: 1.5, display: 'block' }}
                          >
                            {phoneError}
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email Address"
                            type="email"
                            fullWidth
                            required
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={inputSx}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Password */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: brandColors.card,
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: '16px',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <LockIcon sx={{ color: brandColors.primary }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Create Password
                    </Typography>
                  </Box>

                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        required
                        error={!!errors.password}
                        helperText={
                          errors.password?.message ||
                          'Minimum 8 characters, at least one uppercase letter and one number'
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: brandColors.primary, fontSize: 18 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: brandColors.textMuted }}
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon sx={{ fontSize: 20 }} />
                                ) : (
                                  <VisibilityIcon sx={{ fontSize: 20 }} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    )}
                  />
                </Box>

                {/* Agreements */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: brandColors.card,
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: '16px',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>
                    Terms & Privacy
                  </Typography>

                  {(errors.privacyPolicy || errors.termsConditions) && (
                    <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(244,67,54,0.1)', color: '#fff', border: '1px solid rgba(244,67,54,0.3)' }}>
                      Please accept all required agreements to proceed.
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Controller
                      name="privacyPolicy"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              sx={{
                                color: brandColors.border,
                                '&.Mui-checked': { color: brandColors.primary },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              I have read and agree to the{' '}
                              <Box
                                component="span"
                                sx={{
                                  color: brandColors.primary,
                                  cursor: 'pointer',
                                  '&:hover': { textDecoration: 'underline' },
                                }}
                              >
                                Privacy Policy
                              </Box>
                              {' '}*
                            </Typography>
                          }
                        />
                      )}
                    />

                    <Controller
                      name="termsConditions"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              sx={{
                                color: brandColors.border,
                                '&.Mui-checked': { color: brandColors.primary },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              I accept the{' '}
                              <Box
                                component="span"
                                sx={{
                                  color: brandColors.primary,
                                  cursor: 'pointer',
                                  '&:hover': { textDecoration: 'underline' },
                                }}
                              >
                                Terms & Conditions
                              </Box>
                              {' '}*
                            </Typography>
                          }
                        />
                      )}
                    />
                  </Box>
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
                  <GradientButton type="submit" sx={{ px: 5, py: 1.75 }}>
                    Create Account
                  </GradientButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
