import type { ReactElement } from 'react';
import { describe, it, expect, vi } from 'vitest';
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
      screen.getByText(/VITE_GOOGLE_MAPS_API_KEY/i),
    ).toBeInTheDocument();
  });
});

describe('RouteMap', () => {
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
