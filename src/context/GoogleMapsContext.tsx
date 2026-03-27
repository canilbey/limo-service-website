import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries: ('places')[] = ['places'];

export type GoogleMapsContextValue = {
  /** True when `VITE_GOOGLE_MAPS_API_KEY` is set and the JS API finished loading */
  isLoaded: boolean;
  loadError: Error | undefined;
  hasApiKey: boolean;
};

const defaultValue: GoogleMapsContextValue = {
  isLoaded: false,
  loadError: undefined,
  hasApiKey: false,
};

const GoogleMapsContext = createContext<GoogleMapsContextValue>(defaultValue);

function readMapsApiKey(): string {
  const k = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return typeof k === 'string' ? k.trim() : '';
}

function GoogleMapsLoaderInner({
  apiKey,
  children,
}: {
  apiKey: string;
  children: ReactNode;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'limo-google-maps-script',
    googleMapsApiKey: apiKey,
    libraries,
  });

  return (
    <GoogleMapsContext.Provider
      value={{
        isLoaded,
        loadError: loadError ?? undefined,
        hasApiKey: true,
      }}
    >
      {children}
    </GoogleMapsContext.Provider>
  );
}

/**
 * Loads the Maps JavaScript API when a key is present; otherwise exposes `hasApiKey: false`.
 */
export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const apiKey = readMapsApiKey();

  if (!apiKey) {
    return (
      <GoogleMapsContext.Provider value={defaultValue}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <GoogleMapsLoaderInner apiKey={apiKey}>{children}</GoogleMapsLoaderInner>
  );
}

export function useGoogleMaps(): GoogleMapsContextValue {
  return useContext(GoogleMapsContext);
}
