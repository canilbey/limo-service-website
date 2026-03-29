import type { ReactElement } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import { GoogleMapsProvider } from '../context/GoogleMapsContext';
import PlacesAutocomplete from '../components/maps/PlacesAutocomplete';
import RouteMap from '../components/maps/RouteMap';

const renderMapsUi = (ui: ReactElement) =>
  render(
    <ThemeProvider theme={theme}>
      <GoogleMapsProvider>{ui}</GoogleMapsProvider>
    </ThemeProvider>,
  );

describe('PlacesAutocomplete', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders a plain TextField when Google Maps API key is not configured', () => {
    renderMapsUi(
      <PlacesAutocomplete
        label="Pickup"
        value=""
        onChange={vi.fn()}
        onPlaceResolved={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Pickup')).toBeInTheDocument();
    expect(
      screen.getByText(/Add VITE_GOOGLE_MAPS_API_KEY for address suggestions/i),
    ).toBeInTheDocument();
  });
});

describe('RouteMap', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows setup message when Google Maps API key is not configured', () => {
    renderMapsUi(
      <RouteMap
        pickup={{ lat: 40.7, lng: -74 }}
        destination={{ lat: 40.8, lng: -73.9 }}
        waypointCoords={[]}
      />,
    );
    expect(
      screen.getByText(/Route map is unavailable/i),
    ).toBeInTheDocument();
  });
});
