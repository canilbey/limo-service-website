import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { brandColors } from '../../theme';

interface Extra {
  key: keyof ExtrasValue;
  label: string;
  description: string;
  icon: React.ReactNode;
  priceLabel: string;
}

export interface ExtrasValue {
  infantSeat: number;
  childSeat: number;
  boosterSeat: number;
  extraWaiting: number;
}

interface ExtrasSelectorProps {
  value: ExtrasValue;
  onChange: (extras: ExtrasValue) => void;
}

const EXTRAS: Extra[] = [
  {
    key: 'infantSeat',
    label: 'Infant Seat',
    description: 'Ages 0–1 years',
    icon: <ChildCareIcon sx={{ fontSize: 20, color: brandColors.primary }} />,
    priceLabel: '+$15',
  },
  {
    key: 'childSeat',
    label: 'Child Seat',
    description: 'Ages 2–5 years',
    icon: <ChildCareIcon sx={{ fontSize: 20, color: brandColors.primary }} />,
    priceLabel: '+$15',
  },
  {
    key: 'boosterSeat',
    label: 'Booster Seat',
    description: 'Ages 6+ years',
    icon: <AccessibilityIcon sx={{ fontSize: 20, color: brandColors.primary }} />,
    priceLabel: '+$10',
  },
  {
    key: 'extraWaiting',
    label: 'Extra Waiting Time',
    description: 'Per 15 minutes',
    icon: <TimelapseIcon sx={{ fontSize: 20, color: brandColors.primary }} />,
    priceLabel: '+$20',
  },
];

export default function ExtrasSelector({ value, onChange }: ExtrasSelectorProps) {
  const handleDecrement = (key: keyof ExtrasValue) => {
    if (value[key] <= 0) return;
    onChange({ ...value, [key]: value[key] - 1 });
  };

  const handleIncrement = (key: keyof ExtrasValue) => {
    if (value[key] >= 5) return;
    onChange({ ...value, [key]: value[key] + 1 });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {EXTRAS.map((extra) => (
        <Box
          key={extra.key}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: brandColors.cardElevated,
            borderRadius: '12px',
            border: `1px solid ${value[extra.key] > 0 ? brandColors.primary : brandColors.border}`,
            transition: 'border-color 0.2s',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {extra.icon}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {extra.label}
              </Typography>
              <Typography variant="caption" sx={{ color: brandColors.textMuted, fontSize: '0.75rem' }}>
                {extra.description} · {extra.priceLabel}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleDecrement(extra.key)}
              disabled={value[extra.key] <= 0}
              sx={{
                border: `1px solid ${brandColors.border}`,
                color: value[extra.key] > 0 ? '#fff' : brandColors.textMuted,
                width: 32,
                height: 32,
                '&:hover': { borderColor: brandColors.primary, background: 'rgba(255,107,0,0.1)' },
                '&.Mui-disabled': { opacity: 0.3 },
              }}
            >
              <RemoveIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Typography
              sx={{
                minWidth: 28,
                textAlign: 'center',
                fontWeight: 700,
                color: value[extra.key] > 0 ? brandColors.primary : brandColors.textMuted,
                fontSize: '1rem',
              }}
            >
              {value[extra.key]}
            </Typography>

            <IconButton
              size="small"
              onClick={() => handleIncrement(extra.key)}
              disabled={value[extra.key] >= 5}
              sx={{
                border: `1px solid ${brandColors.border}`,
                color: '#fff',
                width: 32,
                height: 32,
                '&:hover': { borderColor: brandColors.primary, background: 'rgba(255,107,0,0.1)' },
                '&.Mui-disabled': { opacity: 0.3 },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
