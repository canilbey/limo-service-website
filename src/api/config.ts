/**
 * Public API base URL (no trailing slash). Set VITE_API_URL in .env for production.
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, '');
  }
  return '';
}
