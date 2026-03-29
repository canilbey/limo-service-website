# Development environment setup

Step-by-step guide to run the limousine booking **frontend** (Vite + React) and **backend** (Express + SQLite) on your machine.

## Prerequisites

- **Node.js**: Current or Active LTS (e.g. 22.x). Verify with `node -v` and `npm -v`.
- **Git**: To clone the repository.
- **Google Cloud project** (optional but recommended): For Places Autocomplete, Directions, and the route map. Without a Maps key, address fields work as plain text and the map is hidden.

## 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd limo-service-website
```

Install root (frontend) and backend packages:

```bash
npm install
cd backend && npm install && cd ..
```

## 2. Environment files

### Frontend (repository root)

Copy the example file and edit values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the API **without** a trailing slash, e.g. `http://localhost:3001`. The Vite dev server (default port `5173`) calls this origin from the browser. |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key. Enable **Maps JavaScript API**, **Places API**, and **Directions API** for your Google Cloud project. |

### Backend (`backend/`)

```bash
cd backend
cp .env.example .env
```

| Variable | Typical dev value |
|----------|-------------------|
| `PORT` | `3001` (default if omitted) |
| `NODE_ENV` | `development` |
| `DB_PATH` | `./data/limo.db` (SQLite file relative to the backend working directory) |
| `JWT_SECRET` | Any long random string (use a stronger one in production) |
| `CORS_ORIGIN` | `http://localhost:5173` (Vite default; include port if yours differs) |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password (change from the example) |

Return to the repo root when finished:

```bash
cd ..
```

## 3. Google Cloud APIs (for maps)

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Maps JavaScript API**, **Places API**, and **Directions API**.
3. Create an API key (Credentials). For local dev you may use HTTP referrer restrictions with `http://localhost:5173/*` (and `http://127.0.0.1:5173/*` if needed).
4. Put the key in root `.env` as `VITE_GOOGLE_MAPS_API_KEY`.

## 4. Seed the admin user

From `backend/`:

```bash
cd backend
npm run seed
cd ..
```

This creates or updates the admin user using `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `backend/.env`.

## 5. Run the stack (two terminals)

**Terminal 1 — API**

```bash
cd backend
npm run dev
```

The API listens on `http://localhost:3001` (or the port in `PORT`).

**Terminal 2 — frontend**

From the **repository root**:

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Ensure `VITE_API_URL` in root `.env` matches the API origin (including scheme and port). If you only run the frontend without a configured API URL, booking submission and admin API calls will fail.

## 6. Verify

- **API health**: `curl http://localhost:3001/health` → JSON `{ "ok": true }`.
- **Browser**: Complete the booking flow on `/` through `/confirmation`.
- **Admin**: Visit `/admin/login`, sign in with the seeded credentials, then `/admin/dashboard`, `/admin/pending`, `/admin/history`.

## 7. Tests

From the **repository root** (frontend + shared vitest config):

```bash
npm test
```

One-shot run (no watch):

```bash
npm test -- --run
```

Coverage:

```bash
npm run test:coverage
```

Backend tests only:

```bash
cd backend && npm test && cd ..
```

## 8. Local production build preview (optional)

To confirm the production bundle builds:

```bash
npm run build
npm run preview
```

Point `VITE_API_URL` at a running API if you need to test API calls from the preview server. Remember: Vite embeds `VITE_*` variables at **build** time, not runtime.

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| CORS errors in the browser | `CORS_ORIGIN` in `backend/.env` must include the exact frontend origin (e.g. `http://localhost:5173`). |
| Booking or admin requests fail | `VITE_API_URL` set, API running, no trailing slash on `VITE_API_URL`. |
| Maps not loading | API key present, required APIs enabled, billing enabled on the Google project, referrer restrictions allow your dev URL. |
| `better-sqlite3` install errors | Use a supported Node version; on Windows, build tools may be required for native modules. |

For production deployment and operational practices, see [SETUP_PRODUCTION.md](./SETUP_PRODUCTION.md).
