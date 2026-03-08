import { Button, type ButtonProps } from '@mui/material';
import { brandColors } from '../../theme';

interface GradientButtonProps extends ButtonProps {
  fullWidth?: boolean;
}

export default function GradientButton({ children, fullWidth, sx, ...props }: GradientButtonProps) {
  return (
    <Button
      variant="contained"
      fullWidth={fullWidth}
      {...props}
      sx={{
        background: brandColors.gradient,
        color: '#fff',
        fontWeight: 700,
        letterSpacing: '0.1em',
        fontSize: '0.85rem',
        py: 1.5,
        px: 3,
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 4px 24px rgba(255,107,0,0.25)',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: brandColors.gradient,
          opacity: 0.9,
          boxShadow: '0 6px 32px rgba(255,107,0,0.4)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&.Mui-disabled': {
          background: '#2A3548',
          color: '#4A5568',
          boxShadow: 'none',
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
