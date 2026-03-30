/// <reference types="vite/client" />

/** Google Ads gtag (loaded from index.html) */
declare function gtag(...args: unknown[]): void;

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  /** Conversion action label for booking submit (Google Ads > Goals > Conversions) */
  readonly VITE_GOOGLE_ADS_CONVERSION_LABEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
