import { Box, Typography, Link as MuiLink } from '@mui/material';
import type { AdminBookingRow } from '../../api/admin';
import { brandColors } from '../../theme';
import AdminBookingMap from './AdminBookingMap';
import { formatBookingExtrasLines } from '../../utils/formatBookingExtras';

function row(label: string, value: string | null | undefined) {
  const v = value != null && String(value).trim() !== '' ? String(value) : '—';
  return (
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      <strong>{label}:</strong> {v}
    </Typography>
  );
}

export default function AdminBookingDetailBody({ booking }: { booking: AdminBookingRow }) {
  const extrasLines = formatBookingExtrasLines(booking.extras);
  const customer = `${booking.title} ${booking.firstName} ${booking.lastName}`.trim();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <AdminBookingMap
        tripType={booking.tripType}
        pickup={booking.pickup}
        destination={booking.destination}
        additionalStops={booking.additionalStops ?? []}
      />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Customer
        </Typography>
        {row('Name', customer)}
        {row('Phone', booking.phone)}
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Email:</strong>{' '}
          {booking.email ? (
            <MuiLink href={`mailto:${booking.email}`} sx={{ color: brandColors.primary }}>
              {booking.email}
            </MuiLink>
          ) : (
            '—'
          )}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Trip
        </Typography>
        {row('Reference', booking.reference)}
        {row('Status', booking.status)}
        {row('Submitted', booking.createdAt)}
        {row('Type', booking.tripType)}
        {row('Pickup', booking.pickup)}
        {row('Destination', booking.destination)}
        {booking.additionalStops?.length ? (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Stops:</strong> {booking.additionalStops.join(' · ')}
          </Typography>
        ) : null}
        {row('Service date', booking.serviceDate)}
        {row('Service time', booking.serviceTime)}
        {booking.hours != null ? row('Hours', String(booking.hours)) : null}
        {row('Est. distance (mi)', booking.estimatedDistanceMiles != null ? String(booking.estimatedDistanceMiles) : null)}
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Vehicle &amp; price
        </Typography>
        {row('Vehicle', booking.vehicleName)}
        {row('Listed price', `$${booking.vehiclePrice}`)}
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Details
        </Typography>
        {row('Booking for', booking.bookingFor)}
        {row('Pickup sign', booking.pickupSign)}
        {row('Flight number', booking.flightNumber)}
        {row('Meeting time', booking.meetingTime)}
        {row('Customer notes', booking.driverNotes)}
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Extras
        </Typography>
        {extrasLines.length ? (
          extrasLines.map((line) => (
            <Typography key={line} variant="body2">
              • {line}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: brandColors.textMuted }}>
            None
          </Typography>
        )}
      </Box>
    </Box>
  );
}
