import { describe, it, expect, vi } from 'vitest';
import { createBooking, type CreateBookingPayload } from './bookings';

vi.mock('./config', () => ({
  getApiBaseUrl: () => '',
}));

const minimalPayload: CreateBookingPayload = {
  bookingForm: {
    tripType: 'trip',
    pickup: 'A',
    destination: 'B',
    date: '2026-01-01',
    time: '12:00',
  },
  selectedVehicle: { id: 'escalade', name: 'Vehicle', price: 100 },
  tripDetails: {
    bookingFor: 'myself',
    pickupSign: 'X',
    extras: { infantSeat: 0, childSeat: 0, boosterSeat: 0, extraWaiting: 0 },
  },
  confirmation: {
    title: 'Mr',
    firstName: 'J',
    lastName: 'D',
    phone: '+10000000000',
  },
};

describe('createBooking', () => {
  it('throws when API base URL is not configured', async () => {
    await expect(createBooking(minimalPayload)).rejects.toThrow('API is not configured');
  });
});
