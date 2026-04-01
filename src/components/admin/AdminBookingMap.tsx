import { useCallback, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { brandColors } from '../../theme';

const defaultCenter = { lat: 40.7128, lng: -74.006 };

export type AdminBookingMapProps = {
  tripType: string;
  pickup: string;
  destination: string | null;
  additionalStops: string[];
};

/**
 * Route preview for admin: uses address strings (Directions API) or a single geocoded point for hourly.
 */
export default function AdminBookingMap({
  tripType,
  pickup,
  destination,
  additionalStops,
}: AdminBookingMapProps) {
  const { isLoaded, loadError, hasApiKey } = useGoogleMaps();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [singlePoint, setSinglePoint] = useState<google.maps.LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(() => {
    if (!isLoaded || !pickup?.trim()) {
      setDirections(null);
      setSinglePoint(null);
      setError(null);
      return;
    }

    const dest = destination?.trim() ?? '';
    const stops = additionalStops.map((s) => s.trim()).filter(Boolean);

    if (tripType === 'hourly' || !dest) {
      setDirections(null);
      setLoading(true);
      setError(null);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: pickup }, (results, status) => {
        setLoading(false);
        if (status !== 'OK' || !results?.[0]?.geometry?.location) {
          setSinglePoint(null);
          setError('Could not locate pickup on the map.');
          return;
        }
        const loc = results[0].geometry.location;
        setSinglePoint({ lat: loc.lat(), lng: loc.lng() });
      });
      return;
    }

    setSinglePoint(null);
    setLoading(true);
    setError(null);
    const service = new google.maps.DirectionsService();
    const waypoints = stops.map((location) => ({
      location,
      stopover: true,
    }));
    service.route(
      {
        origin: pickup,
        destination: dest,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
        provideRouteAlternatives: false,
      },
      (result, status) => {
        setLoading(false);
        if (status !== google.maps.DirectionsStatus.OK || !result) {
          setDirections(null);
          setError('Could not compute route for these addresses.');
          return;
        }
        setDirections(result);
      },
    );
  }, [isLoaded, tripType, pickup, destination, additionalStops]);

  useEffect(() => {
    run();
  }, [run]);

  if (!hasApiKey) {
    return (
      <Box sx={{ p: 2, borderRadius: 2, border: `1px dashed ${brandColors.border}` }}>
        <Typography variant="body2" sx={{ color: brandColors.textMuted }}>
          Map unavailable. Configure VITE_GOOGLE_MAPS_API_KEY on the frontend.
        </Typography>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Typography variant="body2" color="error">
        Could not load Google Maps.
      </Typography>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={28} sx={{ color: brandColors.primary }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${brandColors.border}`,
        backgroundColor: brandColors.card,
      }}
    >
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Trip route
        </Typography>
        {loading && (
          <Typography variant="caption" sx={{ color: brandColors.textMuted }}>
            Loading map…
          </Typography>
        )}
        {error && (
          <Typography variant="caption" color="error" display="block">
            {error}
          </Typography>
        )}
      </Box>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: 280 }}
        center={singlePoint ?? defaultCenter}
        zoom={singlePoint && !directions ? 12 : directions ? undefined : 9}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          disableDefaultUI: false,
        }}
      >
        {directions ? (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: false, preserveViewport: false }}
          />
        ) : null}
        {singlePoint && !directions ? <Marker position={singlePoint} /> : null}
      </GoogleMap>
    </Box>
  );
}
