import { useState } from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LuggageIcon from '@mui/icons-material/Luggage';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { brandColors } from '../../theme';
import GradientButton from '../common/GradientButton';
import type { Vehicle } from '../../types/booking';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onSelect: (vehicle: Vehicle) => void;
}

const vehicleAmenities = ['WiFi', 'Climate Control', 'Phone Charger', 'Bottled Water'];

// Map vehicle ID to image filename prefix
const IMAGE_PREFIX: Record<string, string> = {
  yukon: '/images/main-cars/gmc',
  suburban: '/images/main-cars/chevrolet',
  escalade: '/images/main-cars/cadillac',
  aviator: '/images/main-cars/lincoln_aviator',
  nautilus: '/images/main-cars/lincoln_nautilus',
};

const IMAGE_VIEWS = ['main', 'front', 'back'] as const;
type ImageView = typeof IMAGE_VIEWS[number];

const VIEW_LABELS: Record<ImageView, string> = {
  main: 'Main',
  front: 'Front',
  back: 'Rear',
};

const CLASS_BADGE: Record<string, string> = {
  yukon: 'VAN CLASS',
  suburban: 'VAN CLASS',
  escalade: 'PREMIUM CLASS',
  aviator: 'COMFORT CLASS',
  nautilus: 'STANDARD CLASS',
};

export default function VehicleCard({ vehicle, isSelected, onSelect }: VehicleCardProps) {
  const [viewIndex, setViewIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgFading, setImgFading] = useState(false);

  const prefix = IMAGE_PREFIX[vehicle.id] ?? '/images/main-cars/gmc';
  const currentView = IMAGE_VIEWS[viewIndex];
  const currentImage = `${prefix}_${currentView}.png`;

  const changeView = (e: React.MouseEvent, dir: 1 | -1) => {
    e.stopPropagation();
    setImgFading(true);
    setTimeout(() => {
      setViewIndex((prev) => (prev + dir + IMAGE_VIEWS.length) % IMAGE_VIEWS.length);
      setImgFading(false);
    }, 150);
  };

  return (
    <Box
      onClick={() => onSelect(vehicle)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 3 }}>
          <CheckCircleIcon sx={{ color: brandColors.primary, fontSize: 28 }} />
        </Box>
      )}

      {/* Class badge */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 3 }}>
        <Chip
          label={CLASS_BADGE[vehicle.id] ?? 'LUXURY'}
          size="small"
          sx={{
            background: CLASS_BADGE[vehicle.id]?.includes('PREMIUM')
              ? brandColors.gradient
              : 'rgba(255,107,0,0.12)',
            border: CLASS_BADGE[vehicle.id]?.includes('PREMIUM')
              ? 'none'
              : `1px solid rgba(255,107,0,0.3)`,
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            height: 22,
          }}
        />
      </Box>

      {/* Vehicle image area with carousel */}
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
        {/* Image */}
        <Box
          component="img"
          src={currentImage}
          alt={`${vehicle.name} ${VIEW_LABELS[currentView]}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: imgFading ? 0 : 1,
            transition: 'opacity 0.15s ease',
          }}
        />

        {/* View label dot indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5,
            zIndex: 2,
          }}
        >
          {IMAGE_VIEWS.map((view, i) => (
            <Box
              key={view}
              sx={{
                width: i === viewIndex ? 16 : 6,
                height: 6,
                borderRadius: '3px',
                backgroundColor: i === viewIndex ? brandColors.primary : 'rgba(255,255,255,0.35)',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </Box>

        {/* Left/Right arrows — visible on hover (desktop) or always on touch devices */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 0.5,
            zIndex: 2,
            // on hover devices: show on hover; on touch devices: always show
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            '@media (hover: none)': {
              opacity: 1,
            },
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => changeView(e, -1)}
            sx={{
              backgroundColor: 'rgba(10,14,26,0.7)',
              border: `1px solid ${brandColors.border}`,
              color: '#fff',
              width: 30,
              height: 30,
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(255,107,0,0.3)',
                borderColor: brandColors.primary,
              },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => changeView(e, 1)}
            sx={{
              backgroundColor: 'rgba(10,14,26,0.7)',
              border: `1px solid ${brandColors.border}`,
              color: '#fff',
              width: 30,
              height: 30,
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(255,107,0,0.3)',
                borderColor: brandColors.primary,
              },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
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
