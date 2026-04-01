import { getApiBaseUrl } from './config';

const TOKEN_KEY = 'limo_admin_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export interface AdminBookingRow {
  id: number;
  reference: string;
  tripType: string;
  pickup: string;
  destination: string | null;
  serviceDate: string;
  serviceTime: string;
  hours: number | null;
  vehicleId: string;
  vehicleName: string;
  vehiclePrice: number;
  bookingFor: string | null;
  pickupSign: string | null;
  flightNumber: string | null;
  meetingTime: string | null;
  driverNotes: string | null;
  extras: Record<string, unknown>;
  additionalStops: string[];
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  estimatedDistanceMiles: number | null;
  /** Internal admin / completion notes (not shown to customer). */
  adminNotes: string | null;
  status: string;
  createdAt: string;
}

export interface BookingsListResponse {
  data: AdminBookingRow[];
  page: number;
  limit: number;
  total: number;
}

export interface AdminStats {
  totalBookings: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  completedCount: number;
  totalMiles: number;
  estimatedRevenue: number;
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('API is not configured. Set VITE_API_URL.');
  }
  const token = getStoredToken();
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${base}${path}`, { ...init, headers });
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

  return body as T;
}

export async function adminLogin(username: string, password: string): Promise<{ token: string; username: string }> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('API is not configured. Set VITE_API_URL.');
  }
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = (await res.json().catch(() => null)) as { token?: string; username?: string; error?: string } | null;
  if (!res.ok || !data?.token) {
    throw new Error(data?.error || 'Login failed');
  }
  return { token: data.token, username: data.username ?? username };
}

export async function authMe(): Promise<{ username: string; userId: number }> {
  return adminFetch('/api/auth/me');
}

export async function fetchBookings(params: {
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}): Promise<BookingsListResponse> {
  const q = new URLSearchParams();
  if (params.status) q.set('status', params.status);
  if (params.from) q.set('from', params.from);
  if (params.to) q.set('to', params.to);
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  const qs = q.toString();
  return adminFetch(`/api/admin/bookings${qs ? `?${qs}` : ''}`);
}

export async function fetchBookingById(id: number): Promise<AdminBookingRow> {
  return adminFetch(`/api/admin/bookings/${id}`);
}

export async function patchBooking(
  id: number,
  body: { status?: string; estimatedDistanceMiles?: number | null; adminNotes?: string | null },
): Promise<AdminBookingRow> {
  return adminFetch(`/api/admin/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteBooking(id: number): Promise<void> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('API is not configured. Set VITE_API_URL.');
  }
  const token = getStoredToken();
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(`${base}/api/admin/bookings/${id}`, { method: 'DELETE', headers });
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    let message = `Request failed (${res.status})`;
    try {
      const body = text ? JSON.parse(text) : null;
      if (body && typeof body === 'object' && body !== null && 'error' in body && typeof (body as { error: unknown }).error === 'string') {
        message = (body as { error: string }).error;
      }
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
}

export async function fetchStats(params: { from?: string; to?: string }): Promise<AdminStats> {
  const q = new URLSearchParams();
  if (params.from) q.set('from', params.from);
  if (params.to) q.set('to', params.to);
  const qs = q.toString();
  return adminFetch(`/api/admin/stats${qs ? `?${qs}` : ''}`);
}
