import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import type { LatLng } from '../../types/booking';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { brandColors } from '../../theme';

const defaultMapCenter = { lat: 40.7128, lng: -74.006 };

export type RouteMapProps = {
  pickup: LatLng | null | undefined;
  destination: LatLng | null | undefined;
  /** Intermediate stops with resolved coordinates */
  waypointCoords: LatLng[];
  /** Persist computed driving distance (miles) for booking submission */
  onRouteComputed?: (miles: number | null, durationText?: string) => void;
};

function toLatLngLiteral(p: LatLng): google.maps.LatLngLiteral {
  return { lat: p.lat, lng: p.lng };
}

/**
 * Shows driving directions between pickup, optional waypoints, and destination.
 */
export default function RouteMap({
  pickup,
  destination,
  waypointCoords,
  onRouteComputed,
}: RouteMapProps) {
  const onRouteComputedRef = useRef(onRouteComputed);
  onRouteComputedRef.current = onRouteComputed;

  const { isLoaded, loadError, hasApiKey } = useGoogleMaps();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(
    null,
  );
  const [fetching, setFetching] = useState(false);

  const canRoute = Boolean(
    hasApiKey && isLoaded && pickup && destination,
  );

  const waypoints = useMemo(
    () =>
      waypointCoords.map((w) => ({
        location: toLatLngLiteral(w),
        stopover: true,
      })),
    [waypointCoords],
  );

  const runDirections = useCallback(() => {
    if (!pickup || !destination || !isLoaded) {
      setDirections(null);
      onRouteComputedRef.current?.(null);
      return;
    }

    setFetching(true);
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: toLatLngLiteral(pickup),
        destination: toLatLngLiteral(destination),
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
        provideRouteAlternatives: false,
      },
      (result, status) => {
        setFetching(false);
        if (status !== google.maps.DirectionsStatus.OK || !result) {
          setDirections(null);
          onRouteComputedRef.current?.(null);
          return;
        }
        setDirections(result);

        let meters = 0;
        let seconds = 0;
        for (const route of result.routes) {
          for (const leg of route.legs) {
            if (leg.distance?.value) meters += leg.distance.value;
            if (leg.duration?.value) seconds += leg.duration.value;
          }
        }
        const miles = meters > 0 ? meters / 1609.344 : null;
        const durationText =
          seconds > 0
            ? `${Math.round(seconds / 60)} min`
            : undefined;
        onRouteComputedRef.current?.(miles, durationText);
      },
    );
  }, [pickup, destination, waypoints, isLoaded]);

  useEffect(() => {
    if (!canRoute) {
      setDirections(null);
      setFetching(false);
      onRouteComputedRef.current?.(null);
      return;
    }
    runDirections();
  }, [canRoute, runDirections]);

  if (!hasApiKey) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: '12px',
          border: `1px dashed ${brandColors.border}`,
          backgroundColor: brandColors.card,
        }}
      >
        <Typography variant="body2" sx={{ color: brandColors.textMuted }}>
          Route map is unavailable. Set VITE_GOOGLE_MAPS_API_KEY to preview the trip route.
        </Typography>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        <Typography variant="body2">
          Could not load Google Maps. Check the API key and enabled APIs.
        </Typography>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} sx={{ color: brandColors.primary }} />
      </Box>
    );
  }

  if (!pickup || !destination) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: '12px',
          border: `1px solid ${brandColors.border}`,
          backgroundColor: brandColors.card,
        }}
      >
        <Typography variant="body2" sx={{ color: brandColors.textMuted }}>
          Select pickup and destination from the suggestions list to see the route and distance.
        </Typography>
      </Box>
    );
  }

  const summaryChips =
    directions?.routes[0]?.legs?.length ? (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
        {directions.routes[0].legs.map((leg, i) => (
          <Chip
            key={`leg-${i}-${leg.start_address}`}
            size="small"
            label={`${leg.distance?.text ?? '—'} · ${leg.duration?.text ?? '—'}`}
            sx={{
              backgroundColor: 'rgba(255,107,0,0.12)',
              color: brandColors.primary,
              border: `1px solid rgba(255,107,0,0.25)`,
              fontWeight: 600,
            }}
          />
        ))}
      </Box>
    ) : null;

  return (
    <Box
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${brandColors.border}`,
        backgroundColor: brandColors.card,
      }}
    >
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Trip route
        </Typography>
        {fetching && !directions ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CircularProgress size={18} sx={{ color: brandColors.primary }} />
            <Typography variant="caption" sx={{ color: brandColors.textMuted }}>
              Calculating route…
            </Typography>
          </Box>
        ) : (
          summaryChips
        )}
      </Box>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: 280 }}
        center={defaultMapCenter}
        zoom={directions ? undefined : 10}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          disableDefaultUI: true,
        }}
      >
        {directions ? (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              preserveViewport: false,
            }}
          />
        ) : null}
      </GoogleMap>
    </Box>
  );
}
