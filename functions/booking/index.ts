import { attachDatabasePool } from '@neon/functions';
import { and, asc, eq, gt, lt } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { Pool } from 'pg';
import { bookings, contactMessages } from './schema';

const databaseUrl = process.env.DATABASE_URL;
const timeslotsUrl = process.env.BOOKING_TIMESLOTS_URL;
const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
const authJwksUrl = process.env.NEON_AUTH_JWKS_URL;

if (!databaseUrl || !timeslotsUrl || !authBaseUrl || !authJwksUrl) {
  throw new Error('Booking API requires Postgres, availability provider, and Neon Auth configuration.');
}

const pool = new Pool({ connectionString: databaseUrl, max: 5 });
attachDatabasePool(pool);
const db = drizzle(pool);
const jwks = createRemoteJWKSet(new URL(authJwksUrl));
const authIssuer = new URL(authBaseUrl).origin;
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.BOOKING_APP_ORIGIN ? [process.env.BOOKING_APP_ORIGIN] : []),
]);

interface RecordValue {
  [key: string]: unknown;
}

interface ProviderTimeslot {
  start_time: string;
  end_time: string;
}

interface BookingInput {
  customerName: string;
  customerPhone: string;
  startTime: Date;
  endTime: Date;
  partySize: number;
  location: string | null;
  notes: string;
}

function isRecord(value: unknown): value is RecordValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function withCors(request: Request, response: Response): Response {
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins.has(origin)) return response;
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Headers', 'authorization, content-type');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  headers.set('Vary', 'Origin');
  return new Response(response.body, { status: response.status, headers });
}

function parseLocalTimestamp(value: unknown): Date | null {
  if (typeof value !== 'string' || value.length > 40) return null;
  const localDateTime = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2})?$/.test(value);
  const normalized = localDateTime ? `${value.replace(' ', 'T')}+05:30` : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseBookingFields(input: RecordValue): BookingInput | null {
  const customerName = typeof input.customer_name === 'string' ? input.customer_name.trim() : '';
  const customerPhone = typeof input.customer_phone === 'string' ? input.customer_phone.trim() : '';
  const startTime = parseLocalTimestamp(input.start_time);
  const endTime = parseLocalTimestamp(input.end_time);
  if (!customerName || customerName.length > 80 || !customerPhone || customerPhone.length > 40) return null;
  if (!startTime || !endTime || endTime <= startTime) return null;
  if (typeof input.notes !== 'string' || input.notes.length > 2048) return null;

  let noteData: unknown;
  try {
    noteData = JSON.parse(input.notes);
  } catch {
    return null;
  }
  if (!isRecord(noteData)) return null;

  let extensions: unknown = noteData.extensions;
  if (typeof extensions === 'string') {
    try {
      extensions = JSON.parse(extensions);
    } catch {
      return null;
    }
  }
  if (!isRecord(extensions)) return null;

  const partySize = Number(extensions.party_size);
  const location = typeof extensions.location === 'string' ? extensions.location.trim() : null;
  const notes = typeof noteData.message === 'string' ? noteData.message.trim() : '';
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 8) return null;
  if (location && location.length > 120) return null;
  if (notes.length > 500) return null;

  return { customerName, customerPhone, startTime, endTime, partySize, location, notes };
}

async function readJson(request: Request): Promise<RecordValue | null> {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > 8192) return null;
  const body = await request.text();
  if (body.length > 8192) return null;
  try {
    const parsed: unknown = JSON.parse(body);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function requireUserId(request: Request): Promise<string | Response> {
  const authorization = request.headers.get('authorization');
  if (!authorization?.toLowerCase().startsWith('bearer ')) {
    return jsonResponse({ error: 'Sign in to manage your bookings.' }, 401);
  }

  try {
    const { payload } = await jwtVerify(authorization.slice(7), jwks, {
      algorithms: ['EdDSA'],
      issuer: authIssuer,
      audience: authIssuer,
    });
    if (typeof payload.sub !== 'string') return jsonResponse({ error: 'Invalid session.' }, 401);
    return payload.sub;
  } catch {
    return jsonResponse({ error: 'Your session is invalid or expired. Sign in again.' }, 401);
  }
}

async function getProviderTimeslots(): Promise<ProviderTimeslot[]> {
  const response = await fetch(timeslotsUrl, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Availability provider returned ${response.status}.`);
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error('Availability provider returned an invalid response.');

  return payload.filter((slot): slot is ProviderTimeslot =>
    isRecord(slot) && typeof slot.start_time === 'string' && typeof slot.end_time === 'string',
  );
}

async function getAvailableTimeslots(): Promise<ProviderTimeslot[]> {
  const providerSlots = await getProviderTimeslots();
  const validSlots = providerSlots.flatMap((slot) => {
    const start = parseLocalTimestamp(slot.start_time);
    const end = parseLocalTimestamp(slot.end_time);
    return start && end && end > start ? [{ slot, start, end }] : [];
  });
  if (!validSlots.length) return [];

  const earliest = new Date(Math.min(...validSlots.map(({ start }) => start.getTime())));
  const latest = new Date(Math.max(...validSlots.map(({ end }) => end.getTime())));
  const existing = await db.select({
    startTime: bookings.startTime,
    endTime: bookings.endTime,
  }).from(bookings).where(and(
    eq(bookings.status, 'confirmed'),
    lt(bookings.startTime, latest),
    gt(bookings.endTime, earliest),
  ));

  return validSlots
    .filter(({ start, end }) => !existing.some(
      (booking) => booking.startTime < end && booking.endTime > start,
    ))
    .map(({ slot }) => slot);
}

function postgresCode(error: unknown): string | null {
  if (!isRecord(error)) return null;
  if (typeof error.code === 'string') return error.code;
  return isRecord(error.cause) && typeof error.cause.code === 'string' ? error.cause.code : null;
}

async function handlePublicBooking(request: Request): Promise<Response> {
  const userId = await requireUserId(request);
  if (userId instanceof Response) return userId;

  const input = await readJson(request);
  if (!input) return jsonResponse({ error: 'Invalid booking request.' }, 400);
  const booking = parseBookingFields(input);
  if (!booking) return jsonResponse({ error: 'Please check the booking details and try again.' }, 400);

  let available: ProviderTimeslot[];
  try {
    available = await getAvailableTimeslots();
  } catch (error) {
    console.error('Booking availability could not be checked', error);
    return jsonResponse({ error: 'Availability is temporarily unavailable. Please try again.' }, 502);
  }
  const requestedStart = booking.startTime.getTime();
  const requestedEnd = booking.endTime.getTime();
  const slotIsAvailable = available.some((slot) =>
    parseLocalTimestamp(slot.start_time)?.getTime() === requestedStart
      && parseLocalTimestamp(slot.end_time)?.getTime() === requestedEnd,
  );
  if (!slotIsAvailable) return jsonResponse({ error: 'That time is no longer available. Choose another slot.' }, 409);

  try {
    const [created] = await db.insert(bookings).values({
      customerUserId: userId,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      startTime: booking.startTime,
      endTime: booking.endTime,
      partySize: booking.partySize,
      location: booking.location,
      notes: booking.notes,
      status: 'confirmed',
      source: 'website',
    }).returning({ id: bookings.id });
    return jsonResponse({ code: 'OK', booking_id: created.id }, 201);
  } catch (error) {
    if (postgresCode(error) === '23P01') {
      return jsonResponse({ error: 'That time was just booked. Choose another slot.' }, 409);
    }
    console.error('Customer booking could not be saved to Postgres', error);
    return jsonResponse({ error: 'The booking could not be saved. Please try again.' }, 503);
  }
}

async function handleCustomerBookings(request: Request, url: URL): Promise<Response> {
  const userId = await requireUserId(request);
  if (userId instanceof Response) return userId;

  if (url.pathname === '/account/bookings' && request.method === 'GET') {
    const rows = await db.select({
      id: bookings.id,
      customerName: bookings.customerName,
      customerPhone: bookings.customerPhone,
      customerEmail: bookings.customerEmail,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      partySize: bookings.partySize,
      location: bookings.location,
      notes: bookings.notes,
      status: bookings.status,
    }).from(bookings)
      .where(and(eq(bookings.customerUserId, userId), eq(bookings.status, 'confirmed')))
      .orderBy(asc(bookings.startTime))
      .limit(200);
    return jsonResponse(rows);
  }

  const match = url.pathname.match(/^\/account\/bookings\/([0-9a-f-]{36})$/i);
  if (!match) return jsonResponse({ error: 'Not found.' }, 404);
    if (request.method === 'PATCH') {
    const input = await readJson(request);
    if (!input) return jsonResponse({ error: 'Invalid request.' }, 400);

    const customerName = typeof input.customer_name === 'string' ? input.customer_name.trim() : '';
    const customerPhone = typeof input.customer_phone === 'string' ? input.customer_phone.trim() : '';
    const customerEmail = typeof input.customer_email === 'string' ? input.customer_email.trim() : '';
    const notes = typeof input.notes === 'string' ? input.notes.trim() : '';
    const partySize = Number(input.party_size);

    if (!customerName || customerName.length > 80) {
      return jsonResponse({ error: 'Please enter a name (up to 80 characters).' }, 400);
    }
    if (!customerPhone || customerPhone.length > 40) {
      return jsonResponse({ error: 'Please enter a phone number.' }, 400);
    }
    if (customerEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) || customerEmail.length > 254)) {
      return jsonResponse({ error: 'Please enter a valid email address.' }, 400);
    }
    if (!Number.isInteger(partySize) || partySize < 1 || partySize > 8) {
      return jsonResponse({ error: 'Party size must be between 1 and 8.' }, 400);
    }
    if (notes.length > 500) {
      return jsonResponse({ error: 'Notes can be up to 500 characters.' }, 400);
    }

    const [updated] = await db.update(bookings).set({
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      partySize,
      notes,
      updatedAt: new Date(),
    }).where(and(
      eq(bookings.id, match[1]),
      eq(bookings.customerUserId, userId),
      eq(bookings.status, 'confirmed'),
      gt(bookings.startTime, new Date()),
    )).returning({
      id: bookings.id,
      customerName: bookings.customerName,
      customerPhone: bookings.customerPhone,
      customerEmail: bookings.customerEmail,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      partySize: bookings.partySize,
      location: bookings.location,
      notes: bookings.notes,
      status: bookings.status,
    });
    return updated ? jsonResponse(updated) : jsonResponse({ error: 'Booking not found or already past.' }, 404);
  }
  if (request.method !== 'DELETE') return jsonResponse({ error: 'Method not allowed.' }, 405);

  const [deleted] = await db.delete(bookings).where(and(
    eq(bookings.id, match[1]),
    eq(bookings.customerUserId, userId),
    eq(bookings.status, 'confirmed'),
    gt(bookings.startTime, new Date()),
  )).returning({ id: bookings.id });
  return deleted ? jsonResponse({ deleted: true }) : jsonResponse({ error: 'Booking not found.' }, 404);
}

async function handleContactMessage(request: Request): Promise<Response> {
  const input = await readJson(request);
  if (!input) return jsonResponse({ error: 'Invalid message.' }, 400);

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const topic = typeof input.topic === 'string' ? input.topic.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (!name || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return jsonResponse({ error: 'Please enter a valid name and email address.' }, 400);
  }
  if (!topic || topic.length > 80 || !message || message.length > 500) {
    return jsonResponse({ error: 'Please check the topic and message length.' }, 400);
  }

  const [created] = await db.insert(contactMessages).values({ name, email, topic, message })
    .returning({ id: contactMessages.id });
  return jsonResponse({ saved: true, id: created.id }, 201);
}

async function route(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

  if (url.pathname === '/timeslots' && request.method === 'GET') {
    try {
      return jsonResponse(await getAvailableTimeslots());
    } catch (error) {
      console.error('Booking timeslots request failed', error);
      return jsonResponse({ error: 'Availability is temporarily unavailable.' }, 502);
    }
  }

  if (url.pathname === '/appointments' && request.method === 'POST') {
    return handlePublicBooking(request);
  }

  if (url.pathname === '/account/bookings' || url.pathname.startsWith('/account/bookings/')) {
    return handleCustomerBookings(request, url);
  }

  if (url.pathname === '/messages' && request.method === 'POST') {
    return handleContactMessage(request);
  }

  return jsonResponse({ error: 'Not found.' }, 404);
}

export default {
  async fetch(request: Request): Promise<Response> {
    const origin = request.headers.get('origin');
    if (origin && !allowedOrigins.has(origin)) {
      return new Response('Forbidden origin.', { status: 403 });
    }

    try {
      return withCors(request, await route(request));
    } catch (error) {
      console.error('Booking API request failed', error);
      return withCors(request, jsonResponse({ error: 'The request could not be completed.' }, 500));
    }
  },
};
