import { create } from 'zustand';
import type {
  BookingState,
  BookingFormData,
  Vehicle,
  TripDetailsFormData,
  ConfirmationFormData,
} from '../types/booking';

export const useBookingStore = create<BookingState>((set) => ({
  step: 0,
  bookingForm: null,
  selectedVehicle: null,
  tripDetails: null,
  confirmation: null,

  setStep: (step: number) => set({ step }),

  setBookingForm: (data: BookingFormData) =>
    set({ bookingForm: data }),

  setSelectedVehicle: (vehicle: Vehicle) =>
    set({ selectedVehicle: vehicle }),

  setTripDetails: (data: TripDetailsFormData) =>
    set({ tripDetails: data }),

  setConfirmation: (data: ConfirmationFormData) =>
    set({ confirmation: data }),

  reset: () =>
    set({
      step: 0,
      bookingForm: null,
      selectedVehicle: null,
      tripDetails: null,
      confirmation: null,
    }),
}));
