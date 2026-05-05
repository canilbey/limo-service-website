import type { BookingFormData, TripDetailsFormData, VehicleClass } from '../types/booking';
import {
  CARD_CONVENIENCE_FEE_RATE,
  CHILD_SEAT_EACH_USD,
  MIN_TRANSFER_FARE_USD,
  getPerMileRateUsd,
} from '../constants/pricing';

export interface BookingEstimateBreakdown {
  pricingMode: 'transfer-mile-based' | 'hourly-minimum';
  perMileRateUsd: number;
  estimatedMiles: number | null;
  mileageSubtotalUsd: number;
  minimumApplied: boolean;
  baseFareUsd: number;
  extrasCount: number;
  extrasTotalUsd: number;
  subtotalCashUsd: number;
  cardFeeAmountUsd: number;
  totalWithCardUsd: number;
  isEstimateIncomplete: boolean;
  requiresPhoneConfirmation: boolean;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function getExtrasCount(tripDetails: TripDetailsFormData | null): number {
  if (!tripDetails) return 0;
  const { rearFaceCarSeat, frontFaceCarSeat } = tripDetails.extras;
  return rearFaceCarSeat + frontFaceCarSeat;
}

export function calculateBookingEstimate(params: {
  bookingForm: BookingFormData;
  selectedVehicleId: VehicleClass;
  estimatedDistanceMiles: number | null;
  tripDetails: TripDetailsFormData | null;
}): BookingEstimateBreakdown {
  const { bookingForm, selectedVehicleId, estimatedDistanceMiles, tripDetails } = params;
  const extrasCount = getExtrasCount(tripDetails);
  const extrasTotalUsd = roundMoney(extrasCount * CHILD_SEAT_EACH_USD);
  const perMileRateUsd = getPerMileRateUsd(selectedVehicleId);

  const isTransfer = bookingForm.tripType === 'trip';
  const milesKnown = isTransfer && estimatedDistanceMiles != null;
  const mileageSubtotalUsd = milesKnown ? roundMoney(estimatedDistanceMiles * perMileRateUsd) : 0;
  const transferBaseFareUsd = Math.max(MIN_TRANSFER_FARE_USD, mileageSubtotalUsd);
  const baseFareUsd = isTransfer ? transferBaseFareUsd : MIN_TRANSFER_FARE_USD;
  const minimumApplied = isTransfer ? transferBaseFareUsd === MIN_TRANSFER_FARE_USD : true;
  const subtotalCashUsd = roundMoney(baseFareUsd + extrasTotalUsd);
  const cardFeeAmountUsd = roundMoney(subtotalCashUsd * CARD_CONVENIENCE_FEE_RATE);
  const totalWithCardUsd = roundMoney(subtotalCashUsd + cardFeeAmountUsd);

  return {
    pricingMode: isTransfer ? 'transfer-mile-based' : 'hourly-minimum',
    perMileRateUsd,
    estimatedMiles: milesKnown ? estimatedDistanceMiles : null,
    mileageSubtotalUsd,
    minimumApplied,
    baseFareUsd,
    extrasCount,
    extrasTotalUsd,
    subtotalCashUsd,
    cardFeeAmountUsd,
    totalWithCardUsd,
    isEstimateIncomplete: isTransfer && !milesKnown,
    requiresPhoneConfirmation: bookingForm.tripType === 'hourly',
  };
}
