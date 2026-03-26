import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { getDb } from '../db/database.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAdminAuth);

const statusEnum = z.enum(['pending', 'approved', 'rejected', 'completed']);

const patchBodySchema = z
  .object({
    status: statusEnum.optional(),
    estimatedDistanceMiles: z.number().nonnegative().nullable().optional(),
  })
  .refine((v) => v.status !== undefined || v.estimatedDistanceMiles !== undefined, {
    message: 'At least one field required',
  });

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    reference: row.reference,
    tripType: row.trip_type,
    pickup: row.pickup,
    destination: row.destination,
    serviceDate: row.service_date,
    serviceTime: row.service_time,
    hours: row.hours,
    vehicleId: row.vehicle_id,
    vehicleName: row.vehicle_name,
    vehiclePrice: row.vehicle_price,
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

router.get('/bookings', (req: Request, res: Response) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const from = typeof req.query.from === 'string' ? req.query.from : undefined;
  const to = typeof req.query.to === 'string' ? req.query.to : undefined;
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '50'), 10) || 50));
  const offset = (page - 1) * limit;

  if (status && !['pending', 'approved', 'rejected', 'completed', 'all'].includes(status)) {
    res.status(400).json({ error: 'Invalid status filter' });
    return;
  }

  const db = getDb();
  const conditions: string[] = [];
  const filterParams: Record<string, string> = {};

  if (status && status !== 'all') {
    conditions.push('status = @status');
    filterParams.status = status;
  }
  if (from) {
    conditions.push("date(created_at) >= date(@from)");
    filterParams.from = from;
  }
  if (to) {
    conditions.push("date(created_at) <= date(@to)");
    filterParams.to = to;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countStmt = db.prepare(`SELECT COUNT(*) as c FROM bookings ${where}`);
  const totalRow = countStmt.get(filterParams) as { c: number };

  const listParams = { ...filterParams, limit, offset };
  const rows = db
    .prepare(
      `SELECT * FROM bookings ${where} ORDER BY datetime(created_at) DESC LIMIT @limit OFFSET @offset`,
    )
    .all(listParams) as Record<string, unknown>[];

  res.json({
    data: rows.map(mapRow),
    page,
    limit,
    total: totalRow.c,
  });
});

router.get('/bookings/:id', (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const db = getDb();
  const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(mapRow(row));
});

router.patch('/bookings/:id', (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const parsed = patchBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() });
    return;
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM bookings WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const { status, estimatedDistanceMiles } = parsed.data;
  const sets: string[] = [];
  const values: Record<string, unknown> = { id };

  if (status !== undefined) {
    sets.push('status = @status');
    values.status = status;
  }
  if (estimatedDistanceMiles !== undefined) {
    sets.push('estimated_distance_miles = @miles');
    values.miles = estimatedDistanceMiles;
  }

  db.prepare(`UPDATE bookings SET ${sets.join(', ')} WHERE id = @id`).run(values);

  const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) as Record<string, unknown>;
  res.json(mapRow(row));
});

router.get('/stats', (req: Request, res: Response) => {
  const from = typeof req.query.from === 'string' ? req.query.from : undefined;
  const to = typeof req.query.to === 'string' ? req.query.to : undefined;

  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (from) {
    conditions.push("date(created_at) >= date(@from)");
    params.from = from;
  }
  if (to) {
    conditions.push("date(created_at) <= date(@to)");
    params.to = to;
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const totals = db
    .prepare(
      `SELECT
        COUNT(*) AS totalBookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approvedCount,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejectedCount,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completedCount,
        SUM(CASE WHEN estimated_distance_miles IS NOT NULL THEN estimated_distance_miles ELSE 0 END) AS totalMiles,
        SUM(CASE WHEN status IN ('approved', 'completed') THEN vehicle_price ELSE 0 END) AS estimatedRevenue
      FROM bookings
      ${where}`,
    )
    .get(params) as Record<string, number | null>;

  res.json({
    totalBookings: totals.totalBookings ?? 0,
    pendingCount: totals.pendingCount ?? 0,
    approvedCount: totals.approvedCount ?? 0,
    rejectedCount: totals.rejectedCount ?? 0,
    completedCount: totals.completedCount ?? 0,
    totalMiles: totals.totalMiles ?? 0,
    estimatedRevenue: totals.estimatedRevenue ?? 0,
  });
});

export default router;
