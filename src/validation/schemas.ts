import { z } from 'zod';
import dayjs from 'dayjs';

const MIN_BOOKING_LEAD_HOURS = 6;

export const bookingFormSchema = z
  .object({
    tripType: z.enum(['trip', 'hourly']),
    pickup: z.string().min(2, 'Pickup location is required'),
    destination: z.string().min(2, 'Destination is required').optional().or(z.literal('')),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    hours: z.number().min(1).max(24).optional(),
  })
  .superRefine((data, ctx) => {
    const combined = dayjs(`${data.date}T${data.time}`);
    if (!combined.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid date or time',
        path: ['time'],
      });
      return;
    }
    const earliest = dayjs().add(MIN_BOOKING_LEAD_HOURS, 'hour');
    if (combined.isBefore(earliest)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a time at least 6 hours from now',
        path: ['time'],
      });
    }
  });

export const tripDetailsSchema = z.object({
  bookingFor: z.enum(['myself', 'someone_else']),
  pickupSign: z.string().min(1, 'Pickup sign name is required'),
  flightNumber: z.string().optional().or(z.literal('')),
  meetingTime: z.string().optional().or(z.literal('')),
  driverNotes: z.string().optional().or(z.literal('')),
  extras: z.object({
    infantSeat: z.number().min(0).max(5),
    childSeat: z.number().min(0).max(5),
    boosterSeat: z.number().min(0).max(5),
    extraWaiting: z.number().min(0).max(5),
  }),
});

export const confirmationSchema = z.object({
  title: z.enum(['Mr', 'Mrs', 'Ms', 'Dr']),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(7, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
});

export type BookingFormSchema = z.infer<typeof bookingFormSchema>;
export type TripDetailsSchema = z.infer<typeof tripDetailsSchema>;
export type ConfirmationSchema = z.infer<typeof confirmationSchema>;
