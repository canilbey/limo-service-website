import { createTheme } from '@mui/material/styles';

export const brandColors = {
  background: '#0A0E1A',
  card: '#111827',
  cardElevated: '#1A2235',
  border: '#1E2D45',
  primary: '#FF6B00',
  secondary: '#FFB800',
  gradient: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0BEC5',
  textMuted: '#6B7A8D',
  success: '#4CAF50',
  divider: '#1E2D45',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: brandColors.primary,
      light: brandColors.secondary,
      dark: '#CC5500',
    },
    secondary: {
      main: brandColors.secondary,
    },
    background: {
      default: brandColors.background,
      paper: brandColors.card,
    },
    text: {
      primary: brandColors.textPrimary,
      secondary: brandColors.textSecondary,
    },
    divider: brandColors.divider,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brandColors.background,
          scrollbarColor: `${brandColors.border} ${brandColors.background}`,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: brandColors.background,
          },
          '&::-webkit-scrollbar-thumb': {
            background: brandColors.border,
            borderRadius: '4px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(255, 107, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.card,
          border: `1px solid ${brandColors.border}`,
          borderRadius: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.card,
          border: `1px solid ${brandColors.border}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: brandColors.border,
            },
            '&:hover fieldset': {
              borderColor: brandColors.textMuted,
            },
            '&.Mui-focused fieldset': {
              borderColor: brandColors.primary,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.05em',
          '&.Mui-selected': {
            color: brandColors.primary,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: brandColors.gradient,
          height: '3px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: brandColors.divider,
        },
      },
    },
  },
});

export default theme;
