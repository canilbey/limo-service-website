import { Box, Typography, Divider, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CancelIcon from '@mui/icons-material/Cancel';
import { useBookingStore } from '../../store/bookingStore';
import { brandColors } from '../../theme';

const INCLUDES = [
  {
    icon: <PersonIcon sx={{ fontSize: 18, color: brandColors.primary }} />,
    text: 'First Class professional chauffeur',
  },
  {
    icon: <WaterDropIcon sx={{ fontSize: 18, color: brandColors.primary }} />,
    text: 'Complimentary water in vehicle',
  },
  {
    icon: <CancelIcon sx={{ fontSize: 18, color: brandColors.primary }} />,
    text: 'Free cancellation up to 2 hours',
  },
];

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Box sx={{ color: brandColors.primary, mt: 0.25, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: brandColors.textMuted, display: 'block', fontSize: '0.7rem', letterSpacing: '0.08em', mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function BookingSummary() {
  const { bookingForm, selectedVehicle } = useBookingStore();

  if (!bookingForm) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '—';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: brandColors.card,
        border: `1px solid ${brandColors.border}`,
        borderRadius: '16px',
        p: 3,
        position: { md: 'sticky' },
        top: { md: 90 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Chip
          label={bookingForm.tripType === 'trip' ? 'Transfer' : 'Hourly'}
          size="small"
          sx={{
            backgroundColor: 'rgba(255,107,0,0.15)',
            color: brandColors.primary,
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
            border: `1px solid rgba(255,107,0,0.3)`,
          }}
        />
        <Typography variant="body2" sx={{ color: brandColors.textMuted, fontSize: '0.8rem' }}>
          Booking Summary
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <SummaryRow
          icon={<LocationOnIcon sx={{ fontSize: 18 }} />}
          label="PICKUP"
          value={bookingForm.pickup || '—'}
        />

        {bookingForm.tripType === 'trip' ? (
          <SummaryRow
            icon={<FlightLandIcon sx={{ fontSize: 18 }} />}
            label="DESTINATION"
            value={bookingForm.destination || '—'}
          />
        ) : (
          <SummaryRow
            icon={<AccessTimeIcon sx={{ fontSize: 18 }} />}
            label="DURATION"
            value={`${bookingForm.hours || 2} hours`}
          />
        )}

        <SummaryRow
          icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          label="DATE"
          value={formatDate(bookingForm.date)}
        />

        <SummaryRow
          icon={<AccessTimeIcon sx={{ fontSize: 18 }} />}
          label="TIME"
          value={formatTime(bookingForm.time)}
        />
      </Box>

      {selectedVehicle && (
        <>
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant="caption" sx={{ color: brandColors.textMuted, fontSize: '0.7rem', letterSpacing: '0.08em', display: 'block', mb: 1 }}>
              SELECTED VEHICLE
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {selectedVehicle.name}
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <VerifiedIcon sx={{ fontSize: 16, color: brandColors.primary }} />
          <Typography
            variant="overline"
            sx={{ color: brandColors.textMuted, fontSize: '0.65rem', letterSpacing: '0.15em', fontWeight: 600 }}
          >
            ALL CLASSES INCLUDE
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          {INCLUDES.map(({ icon, text }) => (
            <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {icon}
              <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.82rem' }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
