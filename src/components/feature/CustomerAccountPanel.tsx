import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { authClient } from '@/auth';
import { bookingApiBase } from '@/mocks/booking';

type CustomerBooking = {
  id: string;
  startTime: string;
  endTime: string;
  partySize: number;
  location: string | null;
  notes: string;
  status: string;
};

type CustomerUser = {
  id: string;
  name?: string | null;
  email?: string;
};

interface Props {
  onCustomerNameChange?: (name: string) => void;
}

const authUrl = import.meta.env.VITE_NEON_AUTH_URL || '';

function getErrorMessage(body: unknown): string | null {
  if (typeof body !== 'object' || body === null || !('error' in body)) return null;
  return typeof body.error === 'string' ? body.error : null;
}

export default function CustomerAccountPanel({ onCustomerNameChange }: Props) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyBookingId, setBusyBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refreshAccount = useCallback(async () => {
    setLoading(true);
    setError('');
    if (!authUrl) {
      setError('Customer sign-in is not configured. Please contact Patty Shack.');
      setLoading(false);
      return;
    }

    try {
      const sessionResult = await authClient.getSession({ query: {} });
      if (sessionResult.error) throw new Error(sessionResult.error.message);
      const customer = sessionResult.data?.user ?? null;
      const token = sessionResult.data?.session.token;
      setUser(customer);
      if (!customer || !token) {
        setBookings([]);
        return;
      }

      const response = await fetch(`${bookingApiBase}/account/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(getErrorMessage(body) || 'Could not load your bookings.');
      }
      if (!Array.isArray(body)) throw new Error('The bookings response was invalid.');
      setBookings(body as CustomerBooking[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load your account.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAccount();
    const handleBookingCreated = () => { void refreshAccount(); };
    window.addEventListener('patty-booking-created', handleBookingCreated);
    return () => window.removeEventListener('patty-booking-created', handleBookingCreated);
  }, [refreshAccount]);

  useEffect(() => {
    onCustomerNameChange?.(user?.name?.trim() || '');
  }, [onCustomerNameChange, user]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      const result = registering
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) throw new Error(result.error.message);
      if (registering) setNotice('Account created. If verification is enabled, check your email to finish signing in.');
      await refreshAccount();
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Could not complete sign-in.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    setError('');
    try {
      const result = await authClient.signOut({});
      if (result.error) throw new Error(result.error.message);
      setUser(null);
      setBookings([]);
      setNotice('');
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Could not sign out.');
    }
  }

  async function cancelBooking(booking: CustomerBooking) {
    if (!window.confirm('Cancel and remove this reservation? The released time will become available again.')) return;
    setBusyBookingId(booking.id);
    setError('');
    setNotice('');
    try {
      const sessionResult = await authClient.getSession({ query: {} });
      if (sessionResult.error) throw new Error(sessionResult.error.message);
      const token = sessionResult.data?.session.token;
      if (!token) throw new Error('Your session expired. Sign in again.');

      const response = await fetch(`${bookingApiBase}/account/bookings/${booking.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(getErrorMessage(body) || 'Could not cancel this reservation.');
      }
      setBookings((current) => current.filter((item) => item.id !== booking.id));
      setNotice('Reservation cancelled. That time is available again.');
      window.dispatchEvent(new Event('patty-booking-cancelled'));
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Could not cancel this reservation.');
    } finally {
      setBusyBookingId('');
    }
  }

  return (
    <section id="customer-account" className="poster-card hard-drop bg-background-50 mb-6 p-5 md:p-7 scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="sticker bg-primary-500 text-foreground-950">customer account</span>
          <h2 className="mt-4 text-2xl font-black">Your <span className="text-accent-500">bookings.</span></h2>
        </div>
        {user && (
          <button type="button" onClick={handleSignOut} className="font-bold underline underline-offset-4">
            Sign out
          </button>
        )}
      </div>

      {loading ? (
        <p className="mt-4 text-sm" role="status">Checking your account…</p>
      ) : !user ? (
        <div className="mt-4">
          <p className="text-sm text-foreground-700">Sign in or create an account to book a table and manage your reservations.</p>
          <form onSubmit={handleSignIn} className="mt-4 grid gap-3 sm:grid-cols-2">
            {registering && (
              <label className="grid gap-1 text-sm font-bold">
                Name
                <input required maxLength={80} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="border-2 border-foreground-950 bg-white px-3 py-2 font-normal" />
              </label>
            )}
            <label className="grid gap-1 text-sm font-bold">
              Email
              <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="border-2 border-foreground-950 bg-white px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Password
              <input required type="password" minLength={8} autoComplete={registering ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="border-2 border-foreground-950 bg-white px-3 py-2 font-normal" />
            </label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <button type="submit" disabled={submitting || !authUrl} className="bg-primary-500 border-[2.5px] border-foreground-950 px-4 py-2 font-black disabled:opacity-50">
                {submitting ? 'Please wait…' : registering ? 'Create account' : 'Sign in'}
              </button>
              <button type="button" onClick={() => { setRegistering((current) => !current); setError(''); setNotice(''); }} className="text-sm font-bold underline underline-offset-4">
                {registering ? 'Already have an account? Sign in' : 'New customer? Create an account'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-foreground-700">Signed in as <strong>{user.name || user.email}</strong>.</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-black">Reservations</h3>
            <button type="button" onClick={() => void refreshAccount()} disabled={loading} className="text-sm font-bold underline underline-offset-4 disabled:opacity-50">
              Refresh
            </button>
          </div>
          {bookings.length === 0 ? (
            <p className="mt-2 text-sm">No bookings yet. Choose a time below to reserve your table.</p>
          ) : (
            <ul className="mt-3 grid gap-3">
              {bookings.map((booking) => {
                const upcoming = new Date(booking.startTime).getTime() > Date.now();
                return (
                  <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 border-2 border-foreground-950 p-3">
                    <div className="text-sm">
                      <p className="font-bold">{new Date(booking.startTime).toLocaleString()}</p>
                      <p>{booking.partySize} guests · {booking.location || 'Patty Shack'}</p>
                      {booking.notes && <p className="mt-1 text-foreground-700">{booking.notes}</p>}
                    </div>
                    {upcoming && booking.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => void cancelBooking(booking)}
                        disabled={busyBookingId === booking.id}
                        className="font-bold text-red-700 underline underline-offset-4 disabled:opacity-50"
                      >
                        {busyBookingId === booking.id ? 'Cancelling…' : 'Cancel booking'}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
      {notice && <p className="mt-3 text-sm text-green-800" role="status">{notice}</p>}
    </section>
  );
}
