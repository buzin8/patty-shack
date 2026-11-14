import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  auth: true,
  functions: {
    booking: {
      name: 'Patty Shack booking API',
      source: 'functions/booking/index.ts',
      env: {
        BOOKING_TIMESLOTS_URL: process.env.BOOKING_TIMESLOTS_URL!,
        ...(process.env.BOOKING_APP_ORIGIN
          ? { BOOKING_APP_ORIGIN: process.env.BOOKING_APP_ORIGIN }
          : {}),
      },
    },
  },
});
