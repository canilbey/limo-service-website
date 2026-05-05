import { Box, Typography } from '@mui/material';
import { brandColors } from '../../theme';
import type { VehicleClass } from '../../types/booking';
import { MIN_TRANSFER_FARE_USD, getPerMileRateUsd } from '../../constants/pricing';

interface MilePricingCalloutProps {
  vehicleId: VehicleClass;
  /** When transfer miles and subtotal are known (e.g. during booking flow). */
  estimatedMiles?: number | null;
  transferSubtotalCash?: number | null;
}

export default function MilePricingCallout({
  vehicleId,
  estimatedMiles = null,
  transferSubtotalCash = null,
}: MilePricingCalloutProps) {
  const perMileRateUsd = getPerMileRateUsd(vehicleId);
  const showRouteEstimate =
    estimatedMiles != null && transferSubtotalCash != null && Number.isFinite(transferSubtotalCash);

  return (
    <Box
      sx={{
        mb: 2.5,
        p: 1.5,
        borderRadius: '10px',
        border: `1px solid ${brandColors.border}`,
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 0.3 }}>
        ${perMileRateUsd.toFixed(2)}/mile · Minimum ${MIN_TRANSFER_FARE_USD}
      </Typography>
      {showRouteEstimate ? (
        <Typography variant="caption" sx={{ color: brandColors.textSecondary, fontSize: '0.72rem' }}>
          Route estimate: ${transferSubtotalCash.toFixed(2)} cash subtotal
        </Typography>
      ) : (
        <Typography variant="caption" sx={{ color: brandColors.textSecondary, fontSize: '0.72rem' }}>
          Transfer fare = max(${MIN_TRANSFER_FARE_USD}, miles × ${perMileRateUsd.toFixed(2)})
        </Typography>
      )}
    </Box>
  );
}
