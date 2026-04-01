import { Router } from 'express';
import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { getDb } from '../db/database.js';
import {
  createBookingBodySchema,
  generateBookingReference,
  type CreateBookingBody,
} from '../validation/createBooking.js';
import { sendBookingNotification } from '../services/email.js';

const router = Router();

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

function mapRowToPublicBooking(row: Record<string, unknown>) {
  return {
    id: row.id,
    reference: row.reference,
    tripType: row.trip_type,
    pickup: row.pickup,
    destination: row.destination,
    serviceDate: row.service_date,
    serviceTime: row.service_time,
    hours: row.hours,
    vehicle: {
      id: row.vehicle_id,
      name: row.vehicle_name,
      price: row.vehicle_price,
    },
    bookingFor: row.booking_for,
    pickupSign: row.pickup_sign,
    flightNumber: row.flight_number,
    meetingTime: row.meeting_time,
    driverNotes: row.driver_notes,
    extras: JSON.parse(String(row.extras_json)),
    additionalStops: row.additional_stops_json
      ? JSON.parse(String(row.additional_stops_json))
      : [],
    title: row.title,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    email: row.email,
    estimatedDistanceMiles: row.estimated_distance_miles,
    status: row.status,
    createdAt: row.created_at,
  };
}

router.post('/', bookingLimiter, (req: Request, res: Response) => {
  const parsed = createBookingBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    return;
  }

  const body: CreateBookingBody = parsed.data;
  const { bookingForm, selectedVehicle, tripDetails, confirmation } = body;

  if (bookingForm.tripType === 'trip' && !bookingForm.destination?.trim()) {
    res.status(400).json({ error: 'Destination is required for trip type' });
    return;
  }
  if (bookingForm.tripType === 'hourly' && bookingForm.hours == null) {
    res.status(400).json({ error: 'Hours is required for hourly type' });
    return;
  }

  const db = getDb();
  let reference = generateBookingReference();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const exists = db.prepare('SELECT 1 FROM bookings WHERE reference = ?').get(reference);
    if (!exists) break;
    reference = generateBookingReference();
  }

  const extrasJson = JSON.stringify(tripDetails.extras);
  const stops = tripDetails.additionalStops?.filter((s) => s.trim().length > 0) ?? [];
  const additionalStopsJson = stops.length > 0 ? JSON.stringify(stops) : null;

  const stmt = db.prepare(`
    INSERT INTO bookings (
      reference, trip_type, pickup, destination, service_date, service_time, hours,
      vehicle_id, vehicle_name, vehicle_price,
      booking_for, pickup_sign, flight_number, meeting_time, driver_notes,
      extras_json, additional_stops_json,
      title, first_name, last_name, phone, email,
      estimated_distance_miles, status
    ) VALUES (
      @reference, @trip_type, @pickup, @destination, @service_date, @service_time, @hours,
      @vehicle_id, @vehicle_name, @vehicle_price,
      @booking_for, @pickup_sign, @flight_number, @meeting_time, @driver_notes,
      @extras_json, @additional_stops_json,
      @title, @first_name, @last_name, @phone, @email,
      @estimated_distance_miles, 'pending'
    )
  `);

  const result = stmt.run({
    reference,
    trip_type: bookingForm.tripType,
    pickup: bookingForm.pickup,
    destination: bookingForm.destination?.trim() || null,
    service_date: bookingForm.date,
    service_time: bookingForm.time,
    hours: bookingForm.hours ?? null,
    vehicle_id: selectedVehicle.id,
    vehicle_name: selectedVehicle.name,
    vehicle_price: selectedVehicle.price,
    booking_for: tripDetails.bookingFor,
    pickup_sign: tripDetails.pickupSign,
    flight_number: tripDetails.flightNumber?.trim() || null,
    meeting_time: tripDetails.meetingTime?.trim() || null,
    driver_notes: tripDetails.driverNotes?.trim() || null,
    extras_json: extrasJson,
    additional_stops_json: additionalStopsJson,
    title: confirmation.title,
    first_name: confirmation.firstName,
    last_name: confirmation.lastName,
    phone: confirmation.phone,
    email: confirmation.email?.trim() || null,
    estimated_distance_miles: body.estimatedDistanceMiles ?? null,
  });

  const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid) as Record<
    string,
    unknown
  >;

  void sendBookingNotification({
    reference: String(row.reference),
    tripType: String(row.trip_type),
    pickup: String(row.pickup),
    destination: row.destination != null ? String(row.destination) : null,
    serviceDate: String(row.service_date),
    serviceTime: String(row.service_time),
    hours: row.hours != null ? Number(row.hours) : null,
    vehicleName: String(row.vehicle_name),
    vehiclePrice: Number(row.vehicle_price),
    bookingFor: row.booking_for != null ? String(row.booking_for) : null,
    pickupSign: row.pickup_sign != null ? String(row.pickup_sign) : null,
    flightNumber: row.flight_number != null ? String(row.flight_number) : null,
    meetingTime: row.meeting_time != null ? String(row.meeting_time) : null,
    driverNotes: row.driver_notes != null ? String(row.driver_notes) : null,
    extras: JSON.parse(String(row.extras_json)),
    additionalStops: row.additional_stops_json
      ? (JSON.parse(String(row.additional_stops_json)) as string[])
      : [],
    title: String(row.title),
    firstName: String(row.first_name),
    lastName: String(row.last_name),
    phone: String(row.phone),
    email: row.email != null ? String(row.email) : null,
    estimatedDistanceMiles:
      row.estimated_distance_miles != null ? Number(row.estimated_distance_miles) : null,
  });

  res.status(201).json({
    reference: row.reference,
    id: row.id,
    booking: mapRowToPublicBooking(row),
  });
});

export default router;
