import { useEffect, type ReactNode } from 'react';
import {
  Autocomplete,
  TextField,
  InputAdornment,
  type SxProps,
  type Theme,
} from '@mui/material';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

export type ResolvedPlace = {
  address: string;
  lat: number;
  lng: number;
};

export type PlacesAutocompleteProps = {
  label: string;
  placeholder?: string;
  /** Controlled address text */
  value: string;
  onChange: (address: string) => void;
  /** Called when the user picks a suggestion (with coords) or when the field is cleared */
  onPlaceResolved: (place: ResolvedPlace | null) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
  /** @default 'medium' */
  size?: 'small' | 'medium';
};

/**
 * MUI Autocomplete backed by Google Places Autocomplete.
 * Falls back to a plain text field when there is no API key or the script is not loaded.
 */
export default function PlacesAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  onPlaceResolved,
  error,
  helperText,
  disabled,
  icon,
  sx,
  size = 'medium',
}: PlacesAutocompleteProps) {
  const { isLoaded, hasApiKey } = useGoogleMaps();
  const mapsReady = hasApiKey && isLoaded;

  const {
    ready,
    suggestions: { data, loading },
    setValue: setPlacesValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    initOnMount: mapsReady,
    requestOptions: {
      componentRestrictions: { country: 'us' },
    },
  });

  useEffect(() => {
    setPlacesValue(value, false);
  }, [value, setPlacesValue]);

  if (!mapsReady || !ready) {
    return (
      <TextField
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const text = e.target.value;
          onChange(text);
          if (text.trim() === '') {
            onPlaceResolved(null);
          }
        }}
        fullWidth
        size={size}
        error={error}
        helperText={
          helperText ??
          (!mapsReady && hasApiKey
            ? 'Loading map services…'
            : !hasApiKey
              ? 'Add VITE_GOOGLE_MAPS_API_KEY for address suggestions.'
              : undefined)
        }
        disabled={disabled || (hasApiKey && !isLoaded)}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : undefined,
        }}
        sx={sx}
      />
    );
  }

  const options = data.map((s) => s.description);

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      filterOptions={(x) => x}
      value={value}
      disabled={disabled}
      onInputChange={(_, input, reason) => {
        if (reason === 'input' || reason === 'clear') {
          onChange(input);
          setPlacesValue(input);
          if (input.trim() === '') {
            clearSuggestions();
            onPlaceResolved(null);
          }
        }
      }}
      onChange={async (_, option) => {
        const selected = typeof option === 'string' ? option : option ?? '';
        onChange(selected);
        setPlacesValue(selected, false);
        clearSuggestions();

        if (!selected.trim()) {
          onPlaceResolved(null);
          return;
        }

        try {
          const results = await getGeocode({ address: selected });
          const first = results[0];
          if (!first) {
            onPlaceResolved(null);
            return;
          }
          const { lat, lng } = getLatLng(first);
          onPlaceResolved({ address: selected, lat, lng });
        } catch {
          onPlaceResolved(null);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          size={size}
          InputProps={{
            ...params.InputProps,
            startAdornment: icon ? (
              <InputAdornment position="start">{icon}</InputAdornment>
            ) : (
              params.InputProps.startAdornment
            ),
          }}
          sx={sx}
        />
      )}
    />
  );
}
