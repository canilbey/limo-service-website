import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { createApp, ensureDbInitialized } from '../app.js';
import { closeDb, getDb } from '../db/database.js';
import { aggregateCampaignRows, getGoogleAdsConfig } from '../routes/googleAds.js';

process.env.JWT_SECRET = 'test-jwt-secret-key-32chars!';
process.env.CORS_ORIGIN = '*';

const adsEnvKeys = [
  'GOOGLE_ADS_DEVELOPER_TOKEN',
  'GOOGLE_ADS_CLIENT_ID',
  'GOOGLE_ADS_CLIENT_SECRET',
  'GOOGLE_ADS_REFRESH_TOKEN',
  'GOOGLE_ADS_CUSTOMER_ID',
  'GOOGLE_ADS_LOGIN_CUSTOMER_ID',
] as const;

describe('aggregateCampaignRows', () => {
  it('merges metrics for the same campaign across multiple segment dates', () => {
    const rows = [
      {
        campaign: { id: '1', name: 'Airport', status: 'ENABLED' },
        metrics: { impressions: '100', clicks: '10', costMicros: '5000000', conversions: '2' },
      },
      {
        campaign: { id: '1', name: 'Airport', status: 'ENABLED' },
        metrics: { impressions: 50, clicks: 5, costMicros: 2500000, conversions: 1 },
      },
    ];
    const agg = aggregateCampaignRows(rows);
    expect(agg).toHaveLength(1);
    expect(agg[0].id).toBe('1');
    expect(agg[0].impressions).toBe(150);
    expect(agg[0].clicks).toBe(15);
    expect(agg[0].costMicros).toBe(7500000);
    expect(agg[0].conversions).toBe(3);
    expect(agg[0].ctr).toBeCloseTo(15 / 150, 6);
    expect(agg[0].averageCpcMicros).toBeCloseTo(7500000 / 15, 6);
    expect(agg[0].costPerConversionMicros).toBeCloseTo(7500000 / 3, 6);
  });

  it('accepts snake_case cost_micros from API responses', () => {
    const rows = [
      {
        campaign: { id: '2', name: 'Corporate', status: 'PAUSED' },
        metrics: { impressions: 40, clicks: 8, cost_micros: 4000000, conversions: 1 },
      },
    ];
    const agg = aggregateCampaignRows(rows);
    expect(agg[0].costMicros).toBe(4000000);
  });
});

describe('GET /api/admin/google-ads/campaigns', () => {
  const app = createApp();

  beforeAll(() => {
    closeDb();
    ensureDbInitialized();
    const db = getDb();
    db.prepare('DELETE FROM admin_users').run();
    const hash = bcrypt.hashSync('testpass123', 12);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('adsadmin', hash);
  });

  afterAll(() => {
    closeDb();
  });

  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    for (const k of adsEnvKeys) {
      delete process.env[k];
    }
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/admin/google-ads/campaigns?from=2026-01-01&to=2026-01-31');
    expect(res.status).toBe(401);
  });

  it('returns 400 when date params are missing', async () => {
    const login = await request(app).post('/api/auth/login').send({ username: 'adsadmin', password: 'testpass123' });
    const token = login.body.token as string;
    const res = await request(app)
      .get('/api/admin/google-ads/campaigns')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('returns configured false when Google Ads env is not set', async () => {
    expect(getGoogleAdsConfig()).toBeNull();
    const login = await request(app).post('/api/auth/login').send({ username: 'adsadmin', password: 'testpass123' });
    const token = login.body.token as string;
    const res = await request(app)
      .get('/api/admin/google-ads/campaigns?from=2026-01-01&to=2026-01-31')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.configured).toBe(false);
    expect(res.body.campaigns).toEqual([]);
    expect(res.body.totals).toMatchObject({
      impressions: 0,
      clicks: 0,
      costMicros: 0,
      conversions: 0,
    });
  });

  it('returns 502 when OAuth fails', async () => {
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN = 't';
    process.env.GOOGLE_ADS_CLIENT_ID = 'id';
    process.env.GOOGLE_ADS_CLIENT_SECRET = 'sec';
    process.env.GOOGLE_ADS_REFRESH_TOKEN = 'ref';
    process.env.GOOGLE_ADS_CUSTOMER_ID = '1234567890';
    expect(getGoogleAdsConfig()).not.toBeNull();

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'invalid_grant' }), { status: 400 }),
    );

    const login = await request(app).post('/api/auth/login').send({ username: 'adsadmin', password: 'testpass123' });
    const token = login.body.token as string;
    const res = await request(app)
      .get('/api/admin/google-ads/campaigns?from=2026-01-01&to=2026-01-31')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(502);
    expect(res.body.configured).toBe(true);
    expect(String(res.body.error)).toContain('invalid_grant');
  });
});
