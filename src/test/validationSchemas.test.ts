import { describe, it, expect } from 'vitest';
import { bookingFormSchema, tripDetailsSchema, confirmationSchema } from '../validation/schemas';

describe('Booking Form Validation Schema', () => {
  it('should validate a valid trip booking', () => {
    const result = bookingFormSchema.safeParse({
      tripType: 'trip',
      pickup: 'JFK Airport',
      destination: 'Manhattan',
      date: '2026-04-15',
      time: '14:30',
    });
    expect(result.success).toBe(true);
  });

  it('should validate a valid hourly booking', () => {
    const result = bookingFormSchema.safeParse({
      tripType: 'hourly',
      pickup: 'Times Square',
      date: '2026-04-15',
      time: '10:00',
      hours: 3,
    });
    expect(result.success).toBe(true);
  });

  it('should fail when pickup is too short', () => {
    const result = bookingFormSchema.safeParse({
      tripType: 'trip',
      pickup: 'A',
      destination: 'Manhattan',
      date: '2026-04-15',
      time: '14:30',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when date is missing', () => {
    const result = bookingFormSchema.safeParse({
      tripType: 'trip',
      pickup: 'JFK Airport',
      destination: 'Manhattan',
      date: '',
      time: '14:30',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when time is missing', () => {
    const result = bookingFormSchema.safeParse({
      tripType: 'trip',
      pickup: 'JFK Airport',
      destination: 'Manhattan',
      date: '2026-04-15',
      time: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('Trip Details Validation Schema', () => {
  it('should validate valid trip details', () => {
    const result = tripDetailsSchema.safeParse({
      bookingFor: 'myself',
      pickupSign: 'John Doe',
      flightNumber: 'AA 123',
      meetingTime: '14:45',
      driverNotes: 'Please wait',
      extras: {
        infantSeat: 0,
        childSeat: 1,
        boosterSeat: 0,
        extraWaiting: 0,
      },
    });
    expect(result.success).toBe(true);
  });

  it('should fail when pickupSign is empty', () => {
    const result = tripDetailsSchema.safeParse({
      bookingFor: 'myself',
      pickupSign: '',
      extras: {
        infantSeat: 0,
        childSeat: 0,
        boosterSeat: 0,
        extraWaiting: 0,
      },
    });
    expect(result.success).toBe(false);
  });

  it('should accept booking for someone else', () => {
    const result = tripDetailsSchema.safeParse({
      bookingFor: 'someone_else',
      pickupSign: 'Jane Smith',
      extras: {
        infantSeat: 1,
        childSeat: 0,
        boosterSeat: 0,
        extraWaiting: 2,
      },
    });
    expect(result.success).toBe(true);
  });
});

describe('Confirmation Validation Schema', () => {
  const validConfirmation = {
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+12125550199',
    email: 'john@example.com',
    password: 'SecurePass123',
    privacyPolicy: true,
    termsConditions: true,
  };

  it('should validate a valid confirmation form', () => {
    const result = confirmationSchema.safeParse(validConfirmation);
    expect(result.success).toBe(true);
  });

  it('should fail with invalid email', () => {
    const result = confirmationSchema.safeParse({
      ...validConfirmation,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when password is too short', () => {
    const result = confirmationSchema.safeParse({
      ...validConfirmation,
      password: 'Short1',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when password has no uppercase letter', () => {
    const result = confirmationSchema.safeParse({
      ...validConfirmation,
      password: 'nouppercase123',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when password has no number', () => {
    const result = confirmationSchema.safeParse({
      ...validConfirmation,
      password: 'NoNumbersHere',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when privacy policy is not accepted', () => {
    const result = confirmationSchema.safeParse({
      ...validConfirmation,
      privacyPolicy: false,
    });
    expect(result.success).toBe(false);
  });

  it('should fail when terms are not accepted', () => {
    const result = confirmationSchema.safeParse({
      ...validConfirmation,
      termsConditions: false,
    });
    expect(result.success).toBe(false);
  });

  it('should fail with first name less than 2 characters', () => {
    const result = confirmationSchema.safeParse({
      ...validConfirmation,
      firstName: 'J',
    });
    expect(result.success).toBe(false);
  });

  it('should accept all valid titles', () => {
    const titles = ['Mr', 'Mrs', 'Ms', 'Dr'];
    titles.forEach((title) => {
      const result = confirmationSchema.safeParse({ ...validConfirmation, title });
      expect(result.success).toBe(true);
    });
  });
});
