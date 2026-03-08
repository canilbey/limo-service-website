# Budget Limousine - Premium Limousine Service Website

A luxury limousine booking web application built with React, TypeScript, and Material-UI. Features a multi-step reservation flow with a premium dark-mode UI.

## Tech Stack

- **React 19** + **TypeScript** (Vite build tool)
- **Material-UI (MUI) v7** - Dark theme with custom brand colors
- **React Hook Form** + **Zod** - Form management and validation
- **Zustand** - Lightweight state management
- **React Router DOM v7** - Client-side routing
- **react-phone-input-2** - International phone input with flags
- **Vitest** + **React Testing Library** - Unit testing

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
| 3 | `/confirmation` | Account creation and booking confirmation |

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
│   └── common/     # GradientButton, StepIndicator
├── pages/          # HeroPage, VehicleSelect, TripDetails, Confirmation
└── test/           # Unit tests
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Testing

The project includes 41 unit tests covering:

- **Zustand Store** - State management operations and reset
- **Zod Schemas** - Form validation for all 3 booking steps
- **Components** - GradientButton, ExtrasSelector, StepIndicator, VehicleCard

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
- Booking confirmation with reference number
