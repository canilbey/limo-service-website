import { getApiBaseUrl } from './config';
import { getStoredToken } from './admin';

export interface AdsCampaignRow {
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
}

export interface AdsTotals {
  impressions: number;
  clicks: number;
  costMicros: number;
  conversions: number;
  ctr?: number;
  costPerConversionMicros?: number | null;
}

export type GoogleAdsCampaignsResponse =
  | {
      configured: true;
      dateRange: { from: string; to: string };
      campaigns: AdsCampaignRow[];
      totals: AdsTotals;
    }
  | {
      configured: false;
      error?: string;
      details?: unknown;
      dateRange?: { from: string; to: string };
      campaigns?: AdsCampaignRow[];
      totals?: AdsTotals;
    };

export async function fetchAdsCampaigns(params: { from: string; to: string }): Promise<GoogleAdsCampaignsResponse> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('API is not configured. Set VITE_API_URL.');
  }
  const token = getStoredToken();
  const q = new URLSearchParams({ from: params.from, to: params.to });
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${base}/api/admin/google-ads/campaigns?${q.toString()}`, { headers });
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message =
      body && typeof body === 'object' && body !== null && 'error' in body && typeof (body as { error: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return body as GoogleAdsCampaignsResponse;
}
