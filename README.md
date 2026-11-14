# Patty Shack — Smash Burgers & Charcoal Grill

Customized web application for **Patty Shack** (Infinity Benchmark, Sector V, Kolkata).

## 🍔 Brand & Highlights

- **Restaurant Name:** Patty Shack
- **Location:** Ground Floor, Infinity Benchmark, near RDB Cinema, Sector V, Salt Lake, Kolkata 700091
- **Opening Hours:** Open Every Day · 11:00 – 22:00
- **Phone:** +91 98746 81046
- **Email:** patty.shack@gmail.com
- **Currency:** Indian Rupee (₹)

## 🍔 Menu

- **Burgers (Double Smash & Amul Cheese):**
  - The OG Smash — ₹249
  - Kolkata Heat — ₹279
  - Smoke & Cheddar — ₹299
  - Single Smash — ₹199
  - Mushroom Smash — ₹229
- **From the Grill:**
  - Charcoal Chicken Thighs — ₹289
  - Grilled Sausage Dog — ₹239
  - Flame Corn — ₹149
- **Sides & Drinks:**
  - Fries — ₹129
  - Loaded Shack Fries — ₹199
  - Vanilla Bean Shake — ₹179
  - House Lemonade — ₹99

## 🚀 Tech Stack

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS with custom OKLCH color palettes & poster typography
- **Interactive Burger Canvas:** Custom scroll-driven frame engine (`frameStore.ts`, `heroGeometry.ts`, `heroTimeline.ts`, `drawHeroFrame.ts`) with GSAP `ScrollTrigger` and Lenis smooth scrolling
- **Navigation & Routing:** React Router DOM with route transitions
- **Location & Booking:** Custom wide single-card venue showcase, embedded Google Maps, and interactive booking calendar

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

## Customer Bookings & Contact Messages

The customer account panel is on the Contact page at `/contact#customer-account`. Customers create an account or sign in there, book a table on the same page, see their own reservations, and cancel upcoming bookings. Neon is the reservation source of truth; the availability provider supplies open time slots, while confirmed bookings are stored in SQL and removed from availability when cancelled.

The versioned SQL migrations are in `functions/booking/migrations/`. Apply both migration files to each new Neon branch before using the API. Bookings are in `public.bookings`; contact-form submissions are in `public.contact_messages`. For example:

```sql
SELECT * FROM public.bookings ORDER BY start_time DESC;
SELECT * FROM public.contact_messages ORDER BY created_at DESC;
```

The booking Function needs `BOOKING_TIMESLOTS_URL` and `BOOKING_APP_ORIGIN` in the ignored `.env.local` file. `BOOKING_TIMESLOTS_URL` points to the availability provider; Neon stores and manages reservations.

After linking the project and deploying with `neon deploy --env .env.local`, the frontend uses these values in `.env.local`:

- `VITE_BOOKING_API_URL` should match `NEON_FUNCTION_BOOKING_BASE_URL`.
- `VITE_NEON_AUTH_URL` should match `NEON_AUTH_BASE_URL`.

Restart the Vite server after changing environment values. Before using a production frontend, add its origin to the Neon Auth trusted domains and set `BOOKING_APP_ORIGIN` to that same origin. Customer requests can only access bookings linked to their signed-in Neon Auth user.
