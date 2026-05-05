import type { VehicleClass } from '../types/booking';

export const MIN_TRANSFER_FARE_USD = 95;
export const SMALL_VEHICLE_PER_MILE_USD = 4.5;
export const PREMIUM_VEHICLE_PER_MILE_USD = 6;
export const CHILD_SEAT_EACH_USD = 20;
export const CARD_CONVENIENCE_FEE_RATE = 0.035;

export const PREMIUM_VEHICLE_IDS: ReadonlySet<VehicleClass> = new Set([
  'escalade',
  'suburban',
  'yukon',
]);

export function isPremiumVehicleId(vehicleId: VehicleClass): boolean {
  return PREMIUM_VEHICLE_IDS.has(vehicleId);
}

export function getPerMileRateUsd(vehicleId: VehicleClass): number {
  return isPremiumVehicleId(vehicleId)
    ? PREMIUM_VEHICLE_PER_MILE_USD
    : SMALL_VEHICLE_PER_MILE_USD;
}
