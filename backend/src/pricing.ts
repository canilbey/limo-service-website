export const MIN_TRANSFER_FARE_USD = 95;
export const SMALL_VEHICLE_PER_MILE_USD = 4.5;
export const PREMIUM_VEHICLE_PER_MILE_USD = 6;
export const CHILD_SEAT_EACH_USD = 20;
export const CARD_CONVENIENCE_FEE_RATE = 0.035;

const PREMIUM_VEHICLE_IDS = new Set(['escalade', 'suburban', 'yukon']);

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getPerMileRateUsd(vehicleId: string): number {
  return PREMIUM_VEHICLE_IDS.has(vehicleId)
    ? PREMIUM_VEHICLE_PER_MILE_USD
    : SMALL_VEHICLE_PER_MILE_USD;
}

export function calculateExtrasTotalUsd(extras: {
  rearFaceCarSeat: number;
  frontFaceCarSeat: number;
}): { count: number; totalUsd: number } {
  const count = extras.rearFaceCarSeat + extras.frontFaceCarSeat;
  return { count, totalUsd: roundMoney(count * CHILD_SEAT_EACH_USD) };
}

export function calculateServerBookingPrice(params: {
  tripType: 'trip' | 'hourly';
  vehicleId: string;
  estimatedDistanceMiles: number | null;
  extras: { rearFaceCarSeat: number; frontFaceCarSeat: number };
}) {
  const perMileRateUsd = getPerMileRateUsd(params.vehicleId);
  const extras = calculateExtrasTotalUsd(params.extras);
  const mileageSubtotalUsd =
    params.tripType === 'trip' && params.estimatedDistanceMiles != null
      ? roundMoney(params.estimatedDistanceMiles * perMileRateUsd)
      : 0;
  const baseFareUsd =
    params.tripType === 'trip'
      ? Math.max(MIN_TRANSFER_FARE_USD, mileageSubtotalUsd)
      : MIN_TRANSFER_FARE_USD;
  const minimumApplied = params.tripType === 'hourly' || baseFareUsd === MIN_TRANSFER_FARE_USD;
  const subtotalCashUsd = roundMoney(baseFareUsd + extras.totalUsd);
  const cardFeeAmountUsd = roundMoney(subtotalCashUsd * CARD_CONVENIENCE_FEE_RATE);
  const totalWithCardUsd = roundMoney(subtotalCashUsd + cardFeeAmountUsd);
  const pricingMode = params.tripType === 'trip' ? 'transfer-mile-based' : 'hourly-minimum';

  return {
    pricingMode,
    perMileRateUsd,
    mileageSubtotalUsd,
    estimatedDistanceMiles: params.tripType === 'trip' ? params.estimatedDistanceMiles : null,
    minimumApplied,
    baseFareUsd,
    extrasCount: extras.count,
    extrasTotalUsd: extras.totalUsd,
    subtotalCashUsd,
    cardFeeAmountUsd,
    totalWithCardUsd,
    requiresPhoneConfirmation: params.tripType === 'hourly',
  };
}
