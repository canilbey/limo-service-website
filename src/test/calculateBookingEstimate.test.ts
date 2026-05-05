import { describe, expect, it } from 'vitest';
import { calculateBookingEstimate } from '../utils/calculateBookingEstimate';
import type { BookingFormData } from '../types/booking';

const transferForm: BookingFormData = {
  tripType: 'trip',
  pickup: 'A',
  destination: 'B',
  date: '2026-01-01',
  time: '10:00',
};

const hourlyForm: BookingFormData = {
  tripType: 'hourly',
  pickup: 'A',
  date: '2026-01-01',
  time: '10:00',
  hours: 3,
};

describe('calculateBookingEstimate', () => {
  it('applies $95 minimum for short transfer', () => {
    const result = calculateBookingEstimate({
      bookingForm: transferForm,
      selectedVehicleId: 'aviator',
      estimatedDistanceMiles: 5,
      tripDetails: null,
    });

    expect(result.baseFareUsd).toBe(95);
    expect(result.minimumApplied).toBe(true);
    expect(result.subtotalCashUsd).toBe(95);
  });

  it('uses per-mile subtotal when above minimum', () => {
    const result = calculateBookingEstimate({
      bookingForm: transferForm,
      selectedVehicleId: 'aviator',
      estimatedDistanceMiles: 50,
      tripDetails: null,
    });

    expect(result.mileageSubtotalUsd).toBe(225);
    expect(result.baseFareUsd).toBe(225);
    expect(result.minimumApplied).toBe(false);
  });

  it('uses premium class $6 per mile', () => {
    const result = calculateBookingEstimate({
      bookingForm: transferForm,
      selectedVehicleId: 'escalade',
      estimatedDistanceMiles: 20,
      tripDetails: null,
    });

    expect(result.perMileRateUsd).toBe(6);
    expect(result.baseFareUsd).toBe(120);
  });

  it('adds extras to subtotal and computes card fee', () => {
    const result = calculateBookingEstimate({
      bookingForm: transferForm,
      selectedVehicleId: 'aviator',
      estimatedDistanceMiles: 20,
      tripDetails: {
        bookingFor: 'myself',
        pickupSign: 'John',
        extras: { rearFaceCarSeat: 1, frontFaceCarSeat: 2 },
      },
    });

    expect(result.extrasCount).toBe(3);
    expect(result.extrasTotalUsd).toBe(60);
    expect(result.subtotalCashUsd).toBe(155);
    expect(result.cardFeeAmountUsd).toBe(5.43);
    expect(result.totalWithCardUsd).toBe(160.43);
  });

  it('marks transfer estimate incomplete without miles', () => {
    const result = calculateBookingEstimate({
      bookingForm: transferForm,
      selectedVehicleId: 'aviator',
      estimatedDistanceMiles: null,
      tripDetails: null,
    });

    expect(result.isEstimateIncomplete).toBe(true);
    expect(result.baseFareUsd).toBe(95);
  });

  it('uses hourly minimum with phone confirmation flag', () => {
    const result = calculateBookingEstimate({
      bookingForm: hourlyForm,
      selectedVehicleId: 'yukon',
      estimatedDistanceMiles: null,
      tripDetails: {
        bookingFor: 'myself',
        pickupSign: 'John',
        extras: { rearFaceCarSeat: 0, frontFaceCarSeat: 1 },
      },
    });

    expect(result.pricingMode).toBe('hourly-minimum');
    expect(result.baseFareUsd).toBe(95);
    expect(result.requiresPhoneConfirmation).toBe(true);
    expect(result.subtotalCashUsd).toBe(115);
  });
});
