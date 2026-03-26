import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { createApp, ensureDbInitialized } from '../app.js';
import { closeDb, getDb } from '../db/database.js';

process.env.JWT_SECRET = 'test-jwt-secret-key-32chars!';
process.env.CORS_ORIGIN = '*';

const sampleBooking = {
  bookingForm: {
    tripType: 'trip' as const,
    pickup: '123 Main St',
    destination: 'EWR Airport',
    date: '2026-04-01',
    time: '10:30',
  },
  selectedVehicle: { id: 'escalade', name: 'Cadillac Escalade', price: 199 },
  tripDetails: {
    bookingFor: 'myself' as const,
    pickupSign: 'J. Doe',
    flightNumber: '',
    meetingTime: '',
    driverNotes: '',
    extras: { infantSeat: 0, childSeat: 1, boosterSeat: 0, extraWaiting: 0 },
    additionalStops: [],
  },
  confirmation: {
    title: 'Mr' as const,
    firstName: 'John',
    lastName: 'Doe',
    phone: '+15551234567',
    email: '',
  },
};

describe('API', () => {
  const app = createApp();

  beforeAll(() => {
    closeDb();
    ensureDbInitialized();
    const db = getDb();
    db.prepare('DELETE FROM bookings').run();
    db.prepare('DELETE FROM admin_users').run();
    const hash = bcrypt.hashSync('testpass123', 12);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  });

  afterAll(() => {
    closeDb();
  });

  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('POST /api/bookings creates booking', async () => {
    const res = await request(app).post('/api/bookings').send(sampleBooking);
    expect(res.status).toBe(201);
    expect(res.body.reference).toMatch(/^BL-/);
    expect(res.body.booking.status).toBe('pending');
  });

  it('POST /api/auth/login rejects invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/login returns token', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'testpass123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.username).toBe('admin');
  });

  it('GET /api/admin/bookings requires auth', async () => {
    const res = await request(app).get('/api/admin/bookings');
    expect(res.status).toBe(401);
  });

  it('GET /api/admin/bookings returns data with token', async () => {
    const login = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'testpass123' });
    const token = login.body.token as string;
    const res = await request(app).get('/api/admin/bookings').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/admin/stats returns aggregates', async () => {
    const login = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'testpass123' });
    const token = login.body.token as string;
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.totalBookings).toBe('number');
  });

  it('PATCH cannot mark pending booking as completed', async () => {
    const login = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'testpass123' });
    const token = login.body.token as string;
    const create = await request(app).post('/api/bookings').send(sampleBooking);
    expect(create.status).toBe(201);
    const id = create.body.id as number;
    const res = await request(app)
      .patch(`/api/admin/bookings/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('approved');
  });

  it('PATCH marks approved booking completed with adminNotes', async () => {
    const login = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'testpass123' });
    const token = login.body.token as string;
    const create = await request(app).post('/api/bookings').send({
      ...sampleBooking,
      confirmation: { ...sampleBooking.confirmation, firstName: 'Jane', phone: '+15559876543' },
    });
    expect(create.status).toBe(201);
    const id = create.body.id as number;

    const approve = await request(app)
      .patch(`/api/admin/bookings/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'approved' });
    expect(approve.status).toBe(200);
    expect(approve.body.status).toBe('approved');

    const complete = await request(app)
      .patch(`/api/admin/bookings/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed', adminNotes: 'Paid in cash. Tip noted.' });
    expect(complete.status).toBe(200);
    expect(complete.body.status).toBe('completed');
    expect(complete.body.adminNotes).toBe('Paid in cash. Tip noted.');
  });
});
