import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAdminAuth);

const GOOGLE_ADS_API_VERSION = 'v17';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

const dateParam = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

const querySchema = z.object({
  from: dateParam,
  to: dateParam,
});

export interface GoogleAdsEnvConfig {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string;
  loginCustomerId?: string;
}

export function getGoogleAdsConfig(): GoogleAdsEnvConfig | null {
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim();
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN?.trim();
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID?.replace(/-/g, '').trim();
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, '').trim();

  if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId) {
    return null;
  }
  return {
    developerToken,
    clientId,
    clientSecret,
    refreshToken,
    customerId,
    loginCustomerId: loginCustomerId || undefined,
  };
}

function num(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function fetchAccessToken(config: GoogleAdsEnvConfig): Promise<string> {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const json = (await res.json().catch(() => null)) as { access_token?: string; error?: string } | null;
  if (!res.ok || !json?.access_token) {
    const msg = json?.error ?? `OAuth token request failed (${res.status})`;
    throw new Error(msg);
  }
  return json.access_token;
}

type SearchRow = {
  campaign?: { id?: string; name?: string; status?: string };
  metrics?: Record<string, unknown>;
};

async function searchGoogleAds(
  config: GoogleAdsEnvConfig,
  accessToken: string,
  gaql: string,
): Promise<SearchRow[]> {
  const url = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${config.customerId}/googleAds:search`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': config.developerToken,
    'Content-Type': 'application/json',
  };
  if (config.loginCustomerId) {
    headers['login-customer-id'] = config.loginCustomerId;
  }

  const allResults: SearchRow[] = [];
  let pageToken: string | undefined;

  do {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: gaql,
        pageSize: 10000,
        pageToken,
      }),
    });

    const json = (await res.json().catch(() => null)) as {
      results?: SearchRow[];
      nextPageToken?: string;
      error?: { message?: string; status?: string; details?: unknown[] };
    } | null;

    if (!res.ok) {
      const apiMsg =
        json?.error?.message ??
        (typeof json === 'object' && json !== null ? JSON.stringify(json) : `HTTP ${res.status}`);
      throw new Error(apiMsg);
    }

    if (json?.results?.length) {
      allResults.push(...json.results);
    }
    pageToken = json?.nextPageToken;
  } while (pageToken);

  return allResults;
}

export type AggregatedCampaign = {
  id: string;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  ctr: number;
  averageCpcMicros: number;
  costMicros: number;
  conversions: number;
  costPerConversionMicros: number | null;
};

export function aggregateCampaignRows(rows: SearchRow[]): AggregatedCampaign[] {
  const map = new Map<
    string,
    {
      name: string;
      status: string;
      impressions: number;
      clicks: number;
      costMicros: number;
      conversions: number;
    }
  >();

  for (const row of rows) {
    const id = row.campaign?.id != null ? String(row.campaign.id) : '';
    if (!id) continue;
    const name = row.campaign?.name != null ? String(row.campaign.name) : '';
    const status = row.campaign?.status != null ? String(row.campaign.status) : 'UNKNOWN';
    const m = row.metrics ?? {};
    // REST JSON uses camelCase (proto JSON mapping); accept snake_case as fallback.
    const impressions = num(m.impressions);
    const clicks = num(m.clicks);
    const costMicros = num(m.costMicros ?? (m as Record<string, unknown>).cost_micros);
    const conversions = num(m.conversions);

    const existing = map.get(id);
    if (existing) {
      existing.impressions += impressions;
      existing.clicks += clicks;
      existing.costMicros += costMicros;
      existing.conversions += conversions;
      if (!existing.name && name) existing.name = name;
      existing.status = status;
    } else {
      map.set(id, { name, status, impressions, clicks, costMicros, conversions });
    }
  }

  const out: AggregatedCampaign[] = [];
  for (const [id, agg] of map) {
    const ctr = agg.impressions > 0 ? agg.clicks / agg.impressions : 0;
    const averageCpcMicros = agg.clicks > 0 ? agg.costMicros / agg.clicks : 0;
    const costPerConversionMicros =
      agg.conversions > 0 ? agg.costMicros / agg.conversions : null;
    out.push({
      id,
      name: agg.name || `Campaign ${id}`,
      status: agg.status,
      impressions: agg.impressions,
      clicks: agg.clicks,
      ctr,
      averageCpcMicros,
      costMicros: agg.costMicros,
      conversions: agg.conversions,
      costPerConversionMicros,
    });
  }

  out.sort((a, b) => b.costMicros - a.costMicros);
  return out;
}

router.get('/campaigns', async (req: Request, res: Response) => {
  const parsed = querySchema.safeParse({ from: req.query.from, to: req.query.to });
  if (!parsed.success) {
    res.status(400).json({
      configured: false,
      error: 'Invalid query',
      details: parsed.error.flatten(),
    });
    return;
  }

  const { from, to } = parsed.data;
  if (from > to) {
    res.status(400).json({ configured: false, error: '"from" must be before or equal to "to"' });
    return;
  }

  const config = getGoogleAdsConfig();
  if (!config) {
    res.status(200).json({
      configured: false,
      error:
        'Google Ads API is not configured. Set GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN, and GOOGLE_ADS_CUSTOMER_ID on the server.',
      dateRange: { from, to },
      campaigns: [],
      totals: {
        impressions: 0,
        clicks: 0,
        costMicros: 0,
        conversions: 0,
      },
    });
    return;
  }

  const gaql = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      segments.date,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM campaign
    WHERE segments.date BETWEEN '${from}' AND '${to}'
      AND campaign.status != 'REMOVED'
  `.replace(/\s+/g, ' ');

  try {
    const accessToken = await fetchAccessToken(config);
    const rows = await searchGoogleAds(config, accessToken, gaql.trim());
    const campaigns = aggregateCampaignRows(rows);

    const totals = campaigns.reduce(
      (acc, c) => {
        acc.impressions += c.impressions;
        acc.clicks += c.clicks;
        acc.costMicros += c.costMicros;
        acc.conversions += c.conversions;
        return acc;
      },
      { impressions: 0, clicks: 0, costMicros: 0, conversions: 0 },
    );

    const overallCtr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
    const overallCostPerConversionMicros =
      totals.conversions > 0 ? totals.costMicros / totals.conversions : null;

    res.json({
      configured: true,
      dateRange: { from, to },
      campaigns,
      totals: {
        ...totals,
        ctr: overallCtr,
        costPerConversionMicros: overallCostPerConversionMicros,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Google Ads request failed';
    res.status(502).json({ configured: true, error: message, dateRange: { from, to } });
  }
});

export default router;
