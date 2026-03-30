/**
 * Public API base URL (no trailing slash). Set VITE_API_URL in .env for production.
 * Must be the site origin only (e.g. https://www.example.com), not .../api — all clients
 * append `/api/...` themselves. A trailing `/api` is stripped to avoid `/api/api/...` 404s.
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (!raw) {
    return '';
  }
  let base = raw.replace(/\/$/, '');
  if (base.endsWith('/api')) {
    base = base.slice(0, -4);
  }
  return base.replace(/\/$/, '');
}
