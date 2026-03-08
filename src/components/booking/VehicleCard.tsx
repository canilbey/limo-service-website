import { Box, Typography, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LuggageIcon from '@mui/icons-material/Luggage';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { brandColors } from '../../theme';
import GradientButton from '../common/GradientButton';
import type { Vehicle } from '../../types/booking';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onSelect: (vehicle: Vehicle) => void;
}

const vehicleAmenities = ['WiFi', 'Climate Control', 'Phone Charger', 'Bottled Water'];

export default function VehicleCard({ vehicle, isSelected, onSelect }: VehicleCardProps) {
  return (
    <Box
      onClick={() => onSelect(vehicle)}
      sx={{
        backgroundColor: brandColors.card,
        border: `2px solid ${isSelected ? brandColors.primary : brandColors.border}`,
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          borderColor: isSelected ? brandColors.primary : brandColors.textMuted,
          transform: 'translateY(-2px)',
          boxShadow: isSelected
            ? '0 20px 50px rgba(255,107,0,0.2)'
            : '0 12px 30px rgba(0,0,0,0.4)',
        },
        boxShadow: isSelected ? '0 20px 50px rgba(255,107,0,0.15)' : 'none',
      }}
    >
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          <CheckCircleIcon sx={{ color: brandColors.primary, fontSize: 28 }} />
        </Box>
      )}

      {vehicle.id === 'first' && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
          }}
        >
          <Chip
            label="PREMIUM"
            size="small"
            sx={{
              background: brandColors.gradient,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              height: 22,
            }}
          />
        </Box>
      )}

      {/* Vehicle image area */}
      <Box
        sx={{
          height: 180,
          background: `linear-gradient(135deg, #0D1525 0%, #162035 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {vehicle.image ? (
          <Box
            component="img"
            src={vehicle.image}
            alt={vehicle.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: isSelected
                ? 'radial-gradient(ellipse at center, rgba(255,107,0,0.08) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
            }}
          />
        )}
      </Box>

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
              {vehicle.name}
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.82rem' }}>
              {vehicle.description}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: brandColors.textMuted, display: 'block', fontSize: '0.65rem' }}>
              FROM
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: brandColors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}
            >
              ${vehicle.price}
            </Typography>
          </Box>
        </Box>

        {/* Capacity */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PersonIcon sx={{ fontSize: 16, color: brandColors.primary }} />
            <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.82rem' }}>
              Max {vehicle.maxPassengers} passengers
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LuggageIcon sx={{ fontSize: 16, color: brandColors.primary }} />
            <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.82rem' }}>
              {vehicle.maxLuggage} bags
            </Typography>
          </Box>
        </Box>

        {/* Amenities */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
          {vehicleAmenities.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              size="small"
              icon={
                amenity === 'WiFi' ? (
                  <WifiIcon sx={{ fontSize: '14px !important' }} />
                ) : amenity === 'Climate Control' ? (
                  <AcUnitIcon sx={{ fontSize: '14px !important' }} />
                ) : undefined
              }
              sx={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `1px solid ${brandColors.border}`,
                color: brandColors.textSecondary,
                fontSize: '0.7rem',
                height: 24,
                '& .MuiChip-icon': { color: brandColors.textMuted },
              }}
            />
          ))}
        </Box>

        <GradientButton
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onSelect(vehicle);
          }}
          sx={
            isSelected
              ? {}
              : {
                  background: 'transparent',
                  border: `2px solid ${brandColors.border}`,
                  color: '#fff',
                  boxShadow: 'none',
                  '&:hover': {
                    background: brandColors.gradient,
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(255,107,0,0.3)',
                  },
                }
          }
        >
          {isSelected ? 'Selected' : 'Select'}
        </GradientButton>
      </Box>
    </Box>
  );
}
