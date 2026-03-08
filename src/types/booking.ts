export type TripType = 'trip' | 'hourly';

export type VehicleClass = 'business' | 'van' | 'first';

export interface Vehicle {
  id: VehicleClass;
  name: string;
  description: string;
  maxPassengers: number;
  maxLuggage: number;
  price: number;
  image: string;
}

export interface BookingFormData {
  tripType: TripType;
  pickup: string;
  destination?: string;
  date: string;
  time: string;
  hours?: number;
}

export interface SelectedVehicle {
  vehicle: Vehicle;
}

export interface TripDetailsFormData {
  bookingFor: 'myself' | 'someone_else';
  pickupSign: string;
  flightNumber?: string;
  meetingTime?: string;
  driverNotes?: string;
  extras: {
    infantSeat: number;
    childSeat: number;
    boosterSeat: number;
    extraWaiting: number;
  };
}

export interface ConfirmationFormData {
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  privacyPolicy: boolean;
  termsConditions: boolean;
}

export interface BookingState {
  step: number;
  bookingForm: BookingFormData | null;
  selectedVehicle: Vehicle | null;
  tripDetails: TripDetailsFormData | null;
  confirmation: ConfirmationFormData | null;
  setStep: (step: number) => void;
  setBookingForm: (data: BookingFormData) => void;
  setSelectedVehicle: (vehicle: Vehicle) => void;
  setTripDetails: (data: TripDetailsFormData) => void;
  setConfirmation: (data: ConfirmationFormData) => void;
  reset: () => void;
}
