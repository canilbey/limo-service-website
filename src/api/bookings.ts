import { getApiBaseUrl } from './config';
import type { BookingFormData, ConfirmationFormData, TripDetailsFormData, Vehicle } from '../types/booking';

export interface CreateBookingPayload {
  bookingForm: BookingFormData;
  selectedVehicle: Pick<Vehicle, 'id' | 'name' | 'price'>;
  tripDetails: TripDetailsFormData;
  confirmation: ConfirmationFormData;
  estimatedDistanceMiles?: number | null;
}

export interface CreateBookingResponse {
  reference: string;
  id: number;
}

export async function createBooking(payload: CreateBookingPayload): Promise<CreateBookingResponse> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('API is not configured. Set VITE_API_URL.');
  }

  const res = await fetch(`${base}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookingForm: payload.bookingForm,
      selectedVehicle: {
        id: payload.selectedVehicle.id,
        name: payload.selectedVehicle.name,
        price: payload.selectedVehicle.price,
      },
      tripDetails: {
        bookingFor: payload.tripDetails.bookingFor,
        pickupSign: payload.tripDetails.pickupSign,
        flightNumber: payload.tripDetails.flightNumber,
        meetingTime: payload.tripDetails.meetingTime,
        driverNotes: payload.tripDetails.driverNotes,
        extras: payload.tripDetails.extras,
        additionalStops: payload.tripDetails.additionalStops ?? [],
      },
      confirmation: {
        title: payload.confirmation.title,
        firstName: payload.confirmation.firstName,
        lastName: payload.confirmation.lastName,
        phone: payload.confirmation.phone,
        email: payload.confirmation.email ?? '',
      },
      estimatedDistanceMiles: payload.estimatedDistanceMiles ?? null,
    }),
  });

  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message =
      body && typeof body === 'object' && body !== null && 'error' in body && typeof (body as { error: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `Booking failed (${res.status})`;
    throw new Error(message);
  }

  const data = body as CreateBookingResponse;
  if (!data?.reference) {
    throw new Error('Invalid response from server');
  }
  return data;
}
