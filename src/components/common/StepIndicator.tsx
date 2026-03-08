import { Box, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { brandColors } from '../../theme';

const STEPS = ['Search', 'Select Vehicle', 'Trip Details', 'Confirm'];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3,
        px: 2,
        gap: { xs: 0, sm: 0 },
      }}
    >
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;
        const isLast = index === STEPS.length - 1;

        return (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCompleted
                    ? brandColors.gradient
                    : isActive
                      ? 'transparent'
                      : 'transparent',
                  border: isActive
                    ? `2px solid ${brandColors.primary}`
                    : isCompleted
                      ? 'none'
                      : `2px solid ${brandColors.border}`,
                  color: isCompleted
                    ? '#fff'
                    : isActive
                      ? brandColors.primary
                      : brandColors.textMuted,
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              >
                {isCompleted ? (
                  <CheckIcon sx={{ fontSize: 18 }} />
                ) : (
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                    {stepNumber}
                  </Typography>
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: isActive
                    ? brandColors.primary
                    : isCompleted
                      ? brandColors.textSecondary
                      : brandColors.textMuted,
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {label}
              </Typography>
            </Box>

            {!isLast && (
              <Box
                sx={{
                  width: { xs: 32, sm: 60, md: 80 },
                  height: '2px',
                  background: isCompleted ? brandColors.gradient : brandColors.border,
                  mx: 1,
                  mb: { xs: 0, sm: 3 },
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
        );
      })}
      {theme && null}
    </Box>
  );
}
