# Budget Limousine - Premium Limousine Service Website

A luxury limousine booking web application built with React, TypeScript, and Material-UI. Features a multi-step reservation flow with a premium dark-mode UI.

## Documentation

- [Development setup](docs/SETUP_DEVELOPMENT.md) — local prerequisites, environment variables, running API + Vite, tests
- [Production deployment](docs/SETUP_PRODUCTION.md) — architecture options, build and runtime config, Nginx example, security and operations

## Tech Stack

- **React 19** + **TypeScript** (Vite build tool)
- **Material-UI (MUI) v7** - Dark theme with custom brand colors
- **React Hook Form** + **Zod** - Form management and validation
- **Zustand** - Lightweight state management
- **React Router DOM v7** - Client-side routing
- **react-phone-input-2** - International phone input with flags
- **Vitest** + **React Testing Library** - Unit testing
- **Google Maps JavaScript API** (`@react-google-maps/api`, `use-places-autocomplete`) — Places Autocomplete, driving directions, route map

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#0A0E1A` | Page background |
| Card | `#111827` | Card surfaces |
| Primary (Orange) | `#FF6B00` | Accent, active states |
| Secondary (Gold) | `#FFB800` | Gradient end |
| CTA Gradient | `#FF6B00 → #FFB800` | Action buttons |

## Booking Flow

| Step | Route | Description |
|------|-------|-------------|
| 0 | `/` | Hero page with quick booking form (Trip / Hourly) |
| 1 | `/select-vehicle` | Vehicle class selection (Business, Van, First Class) |
| 2 | `/trip-details` | Trip information, extras (child seats, waiting time) |
| 3 | `/confirmation` | Contact details, API submission, request received |

## Project Structure

```
src/
├── theme/          # MUI dark theme + brand colors
├── store/          # Zustand booking state
├── types/          # TypeScript type definitions
├── validation/     # Zod validation schemas
├── components/
│   ├── layout/     # Navbar, Footer
│   ├── booking/    # BookingFormBar, BookingSummary, VehicleCard, ExtrasSelector
│   ├── maps/       # PlacesAutocomplete, RouteMap (Google Maps)
│   └── common/     # GradientButton, StepIndicator
├── pages/          # HeroPage, VehicleSelect, TripDetails, Confirmation, admin/*
├── api/            # Public booking + admin API client helpers
├── context/        # AuthProvider, GoogleMapsProvider
└── test/           # Unit tests
```

## Backend (Express + SQLite)

The `backend/` folder hosts a small REST API:

- `POST /api/bookings` — public booking submission (rate limited)
- `POST /api/auth/login` — admin JWT login (strict rate limit)
- `GET /api/auth/me` — validate token
- `GET/PATCH /api/admin/*` — bookings list, detail, status & optional miles, dashboard stats

```bash
cd backend
cp .env.example .env   # set JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD, CORS_ORIGIN
npm install
npm run seed           # creates/updates admin user
npm run dev            # http://localhost:3001
```

## Environment variables

**Frontend** (copy root `.env.example` to `.env`):

- `VITE_API_URL` — API origin, e.g. `http://localhost:3001` (no trailing slash)
- `VITE_GOOGLE_MAPS_API_KEY` — Maps JavaScript API key (enable **Maps JavaScript**, **Places**, and **Directions** APIs in Google Cloud). Without it, address fields fall back to plain text and the route map is hidden.

**Backend** — see `backend/.env.example` (`JWT_SECRET`, `DB_PATH`, `CORS_ORIGIN`, admin seed vars).

## Admin panel

| Route | Description |
|-------|-------------|
| `/admin/login` | Sign in (single seeded admin user) |
| `/admin/dashboard` | Metrics + date range + status chart |
| `/admin/pending` | Approve / reject / complete + distance (miles) |
| `/admin/history` | Full booking grid with filters |

## Getting Started

```bash
# Install dependencies
npm install

# (Recommended) Terminal 1 — API
cd backend && npm install && npm run seed && npm run dev

# Terminal 2 — frontend (set VITE_API_URL in .env)
cd ..
npm run dev

# Frontend only (without .env API URL, booking submit will error)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Testing

The project includes unit tests covering:

- **Zustand Store** - State management operations and reset
- **Zod Schemas** - Form validation for all 3 booking steps
- **Components** - GradientButton, ExtrasSelector, StepIndicator, VehicleCard, PlacesAutocomplete, RouteMap
- **API** - Booking client error paths
- **Backend** - Health, bookings, auth, admin routes (Supertest)

```bash
npm test -- --run
```

## Features

- Mobile-first responsive design
- Dark mode premium aesthetic
- Multi-step booking flow with persistent state
- Form validation with helpful error messages
- International phone input with country flags
- Vehicle class comparison (Business, Van, First Class)
- Child seat and extras selection
- Booking request with server-generated reference (pending approval workflow)
- Admin dashboard with JWT auth, SQLite persistence, and MUI data grid/charts
- Google Places address suggestions, interactive trip route map, and automatic `estimatedDistanceMiles` for transfer bookings
