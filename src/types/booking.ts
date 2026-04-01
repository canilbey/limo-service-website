export type TripType = 'trip' | 'hourly';

/** WGS84 coordinates from Google Places / Geocoding */
export interface LatLng {
  lat: number;
  lng: number;
}

/** Optional place resolution for multi-stop routes (UI + Directions API) */
export interface PlaceWithCoords {
  address: string;
  lat?: number;
  lng?: number;
}

export type VehicleClass = 'yukon' | 'suburban' | 'escalade' | 'aviator' | 'nautilus';

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
  /** Set when the user picks a Place for pickup */
  pickupCoords?: LatLng;
  /** Set when the user picks a Place for destination (transfer trips) */
  destinationCoords?: LatLng;
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
    rearFaceCarSeat: number;
    frontFaceCarSeat: number;
  };
  /** Additional stop addresses (optional). Persisted for API submission. */
  additionalStops?: string[];
}

export interface ConfirmationFormData {
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr';
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

export interface BookingState {
  step: number;
  bookingForm: BookingFormData | null;
  selectedVehicle: Vehicle | null;
  tripDetails: TripDetailsFormData | null;
  confirmation: ConfirmationFormData | null;
  /** Driving distance in miles from Directions API (transfer + stops), null if unknown */
  estimatedDistanceMiles: number | null;
  setStep: (step: number) => void;
  setBookingForm: (data: BookingFormData) => void;
  setSelectedVehicle: (vehicle: Vehicle) => void;
  setTripDetails: (data: TripDetailsFormData) => void;
  setConfirmation: (data: ConfirmationFormData) => void;
  setEstimatedDistance: (miles: number | null) => void;
  reset: () => void;
}
