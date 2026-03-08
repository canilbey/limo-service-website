import { describe, it, expect, beforeEach } from 'vitest';
import { useBookingStore } from '../store/bookingStore';
import type { BookingFormData, Vehicle, TripDetailsFormData, ConfirmationFormData } from '../types/booking';

const mockBookingForm: BookingFormData = {
  tripType: 'trip',
  pickup: 'JFK Airport',
  destination: 'Manhattan, New York',
  date: '2026-04-15',
  time: '14:30',
};

const mockVehicle: Vehicle = {
  id: 'business',
  name: 'Business Class',
  description: 'Executive sedan',
  maxPassengers: 3,
  maxLuggage: 2,
  price: 85,
  image: '',
};

const mockTripDetails: TripDetailsFormData = {
  bookingFor: 'myself',
  pickupSign: 'John Doe',
  flightNumber: 'AA 123',
  meetingTime: '14:45',
  driverNotes: 'Please wait at terminal 4',
  extras: {
    infantSeat: 0,
    childSeat: 1,
    boosterSeat: 0,
    extraWaiting: 0,
  },
};

const mockConfirmation: ConfirmationFormData = {
  title: 'Mr',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+12125550199',
  email: 'john.doe@example.com',
};

describe('Booking Store', () => {
  beforeEach(() => {
    useBookingStore.getState().reset();
  });

  it('should initialize with default values', () => {
    const state = useBookingStore.getState();
    expect(state.step).toBe(0);
    expect(state.bookingForm).toBeNull();
    expect(state.selectedVehicle).toBeNull();
    expect(state.tripDetails).toBeNull();
    expect(state.confirmation).toBeNull();
  });

  it('should update step correctly', () => {
    useBookingStore.getState().setStep(2);
    expect(useBookingStore.getState().step).toBe(2);
  });

  it('should store booking form data', () => {
    useBookingStore.getState().setBookingForm(mockBookingForm);
    const state = useBookingStore.getState();
    expect(state.bookingForm).toEqual(mockBookingForm);
    expect(state.bookingForm?.pickup).toBe('JFK Airport');
    expect(state.bookingForm?.tripType).toBe('trip');
  });

  it('should store selected vehicle', () => {
    useBookingStore.getState().setSelectedVehicle(mockVehicle);
    const state = useBookingStore.getState();
    expect(state.selectedVehicle).toEqual(mockVehicle);
    expect(state.selectedVehicle?.id).toBe('business');
    expect(state.selectedVehicle?.price).toBe(85);
  });

  it('should store trip details', () => {
    useBookingStore.getState().setTripDetails(mockTripDetails);
    const state = useBookingStore.getState();
    expect(state.tripDetails).toEqual(mockTripDetails);
    expect(state.tripDetails?.pickupSign).toBe('John Doe');
    expect(state.tripDetails?.extras.childSeat).toBe(1);
  });

  it('should store confirmation data', () => {
    useBookingStore.getState().setConfirmation(mockConfirmation);
    const state = useBookingStore.getState();
    expect(state.confirmation).toEqual(mockConfirmation);
    expect(state.confirmation?.email).toBe('john.doe@example.com');
  });

  it('should reset all state to defaults', () => {
    useBookingStore.getState().setStep(3);
    useBookingStore.getState().setBookingForm(mockBookingForm);
    useBookingStore.getState().setSelectedVehicle(mockVehicle);

    useBookingStore.getState().reset();

    const state = useBookingStore.getState();
    expect(state.step).toBe(0);
    expect(state.bookingForm).toBeNull();
    expect(state.selectedVehicle).toBeNull();
    expect(state.tripDetails).toBeNull();
    expect(state.confirmation).toBeNull();
  });

  it('should handle hourly trip type', () => {
    const hourlyBooking: BookingFormData = {
      tripType: 'hourly',
      pickup: 'Times Square, New York',
      date: '2026-04-15',
      time: '10:00',
      hours: 4,
    };
    useBookingStore.getState().setBookingForm(hourlyBooking);
    const state = useBookingStore.getState();
    expect(state.bookingForm?.tripType).toBe('hourly');
    expect(state.bookingForm?.hours).toBe(4);
    expect(state.bookingForm?.destination).toBeUndefined();
  });
});
