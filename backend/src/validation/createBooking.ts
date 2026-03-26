import { z } from 'zod';

const bookingFormSchema = z.object({
  tripType: z.enum(['trip', 'hourly']),
  pickup: z.string().min(1),
  destination: z.string().optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  hours: z.number().int().min(1).max(24).optional(),
});

const vehicleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
});

const tripDetailsSchema = z.object({
  bookingFor: z.enum(['myself', 'someone_else']),
  pickupSign: z.string().min(1),
  flightNumber: z.string().optional(),
  meetingTime: z.string().optional(),
  driverNotes: z.string().optional(),
  extras: z.object({
    infantSeat: z.number().int().min(0),
    childSeat: z.number().int().min(0),
    boosterSeat: z.number().int().min(0),
    extraWaiting: z.number().int().min(0),
  }),
  additionalStops: z.array(z.string()).optional(),
});

const confirmationSchema = z.object({
  title: z.enum(['Mr', 'Mrs', 'Ms', 'Dr']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(5),
  email: z.string().email().optional().or(z.literal('')),
});

export const createBookingBodySchema = z.object({
  bookingForm: bookingFormSchema,
  selectedVehicle: vehicleSchema,
  tripDetails: tripDetailsSchema,
  confirmation: confirmationSchema,
  estimatedDistanceMiles: z.number().nonnegative().nullable().optional(),
});

export type CreateBookingBody = z.infer<typeof createBookingBodySchema>;

export function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BL-${suffix}`;
}
