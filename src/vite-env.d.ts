/// <reference types="vite/client" />

declare const __BASE_PATH__: string;

interface ImportMetaEnv {
  readonly VITE_BOOKING_API_URL: string;
  readonly VITE_NEON_AUTH_URL: string;
}
