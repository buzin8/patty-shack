import {
  useCallback, useEffect, useMemo, useState, type CSSProperties, type FormEvent,
} from 'react';
import { authClient } from '@/auth';

export interface Timeslot { start_time: string; end_time: string }

export interface BookingTexts {
  stepDate: string; stepTime: string; stepDetails: string;
  prevMonth: string; nextMonth: string; weekdays: string[]; months: string[];
  loading: string; loadError: string; retry: string; noSlots: string; slotsFor: string; back: string;
  reviewTitle: string; reviewDate: string; reviewTime: string; modifyTime: string;
  nameLabel: string; namePlaceholder: string; phoneLabel: string; phonePlaceholder: string;
  partyLabel: string; locationLabel: string; notesLabel: string; notesPlaceholder: string;
  submit: string; submitting: string; required: string; submitError: string;
  successTitle: string; successBody: string; bookAnother: string;
}

interface Props {
  timeslotsApi: string;
  appointmentsApi: string;
  texts: BookingTexts;
  locations?: string[];
  customerName?: string;
  containerStyle?: CSSProperties;
}

interface FormState { name: string; phone: string; party: string; location: string; notes: string }

const pad = (n: number) => String(n).padStart(2, '0');
const dateOf = (s: string) => s.split(' ')[0];
function formatTime(value: string) {
  const match = value.match(/[ T](\d{2}):(\d{2})/);
  if (!match) return value;
  const hour = Number(match[1]);
  const minute = match[2];
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? 'AM' : 'PM'}`;
}
const ymOf = (d: string) => d.slice(0, 7);

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pickTarget(dates: string[], today: string) {
  if (!dates.length) return '';
  return dates.find((d) => d >= today) || dates[dates.length - 1];
}

export function BookingCalendar({
  timeslotsApi, appointmentsApi, texts, locations = [], customerName = '', containerStyle,
}: Props) {
  const [slots, setSlots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [step, setStep] = useState(0);
  const [viewYm, setViewYm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Timeslot | null>(null);
  const [form, setForm] = useState<FormState>({
    name: '', phone: '', party: '2', location: locations[0] || '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [dir, setDir] = useState(1);
  const [monthDir, setMonthDir] = useState(1);
  const go = (n: number) => { setDir(n >= step ? 1 : -1); setStep(n); };

  useEffect(() => {
    setForm((current) => ({ ...current, name: customerName.trim() }));
  }, [customerName]);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetch(timeslotsApi);
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch {
      setLoadError(texts.loadError);
    } finally {
      setLoading(false);
    }
  }, [timeslotsApi, texts.loadError]);

  useEffect(() => {
    void fetchSlots();
    const handleBookingCancelled = () => { void fetchSlots(); };
    window.addEventListener('patty-booking-cancelled', handleBookingCancelled);
    return () => window.removeEventListener('patty-booking-cancelled', handleBookingCancelled);
  }, [fetchSlots]);

  const byDate = useMemo(() => {
    const m = new Map<string, Timeslot[]>();
    slots.forEach((s) => {
      const d = dateOf(s.start_time);
      if (!m.has(d)) m.set(d, []);
      m.get(d)!.push(s);
    });
    return m;
  }, [slots]);
  const dates = useMemo(() => Array.from(byDate.keys()).sort(), [byDate]);

  // Month follows availability; auto-select closest available date.
  useEffect(() => {
    if (!dates.length) return;
    const target = pickTarget(dates, todayStr());
    setViewYm((cur) => (cur && dates.some((d) => ymOf(d) === cur) ? cur : ymOf(target)));
    setSelectedDate((cur) => (cur && byDate.has(cur) ? cur : target));
  }, [dates, byDate]);

  const grid = useMemo(() => {
    if (!viewYm) return [];
    const [y, m] = viewYm.split('-').map(Number);
    const first = new Date(y, m - 1, 1).getDay();
    const total = new Date(y, m, 0).getDate();
    const cells: (string | null)[] = Array(first).fill(null);
    for (let d = 1; d <= total; d += 1) cells.push(`${viewYm}-${pad(d)}`);
    while (cells.length % 7) cells.push(null);
    return cells;
  }, [viewYm]);

  const shiftMonth = (delta: number) => {
    setMonthDir(delta);
    const [y, m] = viewYm.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setViewYm(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
  };

  const set = (k: keyof FormState) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSlot) return;
    if (!form.phone.trim()) { setFormError(texts.required); return; }
    setSubmitting(true);
    setFormError('');
    try {
      const sessionResult = await authClient.getSession({ query: {} });
      if (sessionResult.error) throw new Error(sessionResult.error.message);
      const token = sessionResult.data?.session.token;
      if (!token) throw new Error('Sign in above before booking a table.');
      const reservationName = customerName.trim()
        || sessionResult.data?.user?.name?.trim()
        || form.name.trim();
      if (!reservationName) { setFormError(texts.required); return; }

      const extensions: Record<string, string> = { party_size: form.party };
      if (form.location) extensions.location = form.location;
      const res = await fetch(appointmentsApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_name: reservationName,
          customer_phone: form.phone.trim(),
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          notes: JSON.stringify({ message: form.notes.trim(), extensions: JSON.stringify(extensions) }),
        }),
      });
      const text = await res.text();
      let parsed: { code?: string; message?: string; meta?: { message?: string } } | null = null;
      try { parsed = text ? JSON.parse(text) : null; } catch { parsed = null; }
      const badCode = parsed && typeof parsed.code === 'string' && parsed.code !== 'OK';
      if (!res.ok || badCode) {
        throw new Error(parsed?.meta?.message || parsed?.message || texts.submitError);
      }
      setDone(true);
      setSelectedDate('');
      setSelectedSlot(null);
      setForm({ name: customerName.trim(), phone: '', party: '2', location: locations[0] || '', notes: '' });
      go(0);
      fetchSlots();
      window.dispatchEvent(new Event('patty-booking-created'));
    } catch (err) {
      setFormError(err instanceof Error && err.message ? err.message : texts.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  const minYm = dates.length ? ymOf(dates[0]) : '';
  const maxYm = dates.length ? ymOf(dates[dates.length - 1]) : '';
  const steps = [texts.stepDate, texts.stepTime, texts.stepDetails];
  const [vy, vm] = viewYm ? viewYm.split('-').map(Number) : [0, 0];
  const input = 'w-full box-border rounded-md border-[2.5px] border-foreground-950 bg-background-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400';

  return (
    <div className="poster-card hard-drop bg-background-50 p-5 md:p-7 lg:p-8" style={containerStyle}>
      <ol className="flex flex-wrap gap-2 mb-6 pb-5 border-b-[2.5px] border-dashed border-foreground-300">
        {steps.map((s, i) => (
          <li key={s} className={`sticker !text-[14px] !shadow-none ${i === step ? 'bg-accent-500 text-background-50' : i < step ? 'bg-primary-500 text-foreground-950' : 'bg-background-100 text-foreground-600'}`}>{s}</li>
        ))}
      </ol>

      {done && step === 0 && (
        <div className="mb-6 rounded-lg border-[2.5px] border-foreground-950 bg-primary-100 p-4 flex items-start justify-between gap-4">
          <div>
            <p className="h-card !text-[20px]">{texts.successTitle}</p>
            <p className="text-sm mt-1">{texts.successBody}</p>
          </div>
          <button type="button" onClick={() => setDone(false)} className="w-8 h-8 flex items-center justify-center cursor-pointer shrink-0" aria-label={texts.bookAnother}><i className="ri-close-line text-xl" /></button>
        </div>
      )}

      {loading && <p className="hand text-lg py-10 text-center">{texts.loading}</p>}
      {!loading && loadError && (
        <div className="py-10 text-center">
          <p className="mb-4">{loadError}</p>
          <button type="button" onClick={fetchSlots} className="btn-poster btn-paper btn-sm">{texts.retry}</button>
        </div>
      )}
      {!loading && !loadError && !dates.length && <p className="py-10 text-center">{texts.noSlots}</p>}

      <div key={`step-${step}`} className={dir > 0 ? 'bk-in-next' : 'bk-in-prev'}>
      {!loading && !loadError && dates.length > 0 && step === 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button type="button" disabled={viewYm <= minYm} onClick={() => shiftMonth(-1)} aria-label={texts.prevMonth} className="disabled:opacity-30 disabled:cursor-not-allowed w-10 h-10 flex items-center justify-center rounded-full border-[2.5px] border-foreground-950 cursor-pointer hover:bg-primary-500 transition-colors"><i className="ri-arrow-left-s-line text-xl" /></button>
            <p className="h-card !text-[22px]">{texts.months[vm - 1]} {vy}</p>
            <button type="button" disabled={viewYm >= maxYm} onClick={() => shiftMonth(1)} aria-label={texts.nextMonth} className="disabled:opacity-30 disabled:cursor-not-allowed w-10 h-10 flex items-center justify-center rounded-full border-[2.5px] border-foreground-950 cursor-pointer hover:bg-primary-500 transition-colors"><i className="ri-arrow-right-s-line text-xl" /></button>
          </div>
          <div key={viewYm} className={`grid grid-cols-7 gap-1.5 md:gap-2 ${monthDir > 0 ? 'bk-in-next' : 'bk-in-prev'}`}>
            {grid.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const ok = byDate.has(d);
              const sel = d === selectedDate;
              return (
                <button
                  key={d}
                  type="button"
                  disabled={!ok}
                  onClick={() => { setSelectedDate(d); setSelectedSlot(null); go(1); }}
                  className={`flex flex-col items-center justify-center rounded-md border-[2px] py-2 transition-colors ${sel ? 'bg-accent-500 text-background-50 border-foreground-950 cursor-pointer' : ok ? 'bg-primary-100 border-foreground-950 hover:bg-primary-500 cursor-pointer' : 'border-transparent text-foreground-300 cursor-not-allowed'}`}
                >
                  <span className="text-[10px] uppercase tracking-wider">{texts.weekdays[i % 7]}</span>
                  <span className="font-bold text-sm md:text-base">{Number(d.slice(8))}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="hand text-lg mb-4">{texts.slotsFor} {selectedDate}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(byDate.get(selectedDate) || []).map((s) => (
              <button
                key={s.start_time}
                type="button"
                onClick={() => { setSelectedSlot(s); go(2); }}
                className={`rounded-md border-[2.5px] border-foreground-950 px-3 py-3 font-bold text-sm whitespace-nowrap cursor-pointer transition-colors ${selectedSlot?.start_time === s.start_time ? 'bg-accent-500 text-background-50' : 'bg-background-50 hover:bg-primary-500'}`}
              >
                {formatTime(s.start_time)} – {formatTime(s.end_time)}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(0)} className="btn-poster btn-paper btn-sm mt-6">{texts.back}</button>
        </div>
      )}

      {step === 2 && selectedSlot && (
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 rounded-lg bg-secondary-500 text-background-50 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-6">
              <div><p className="hand text-xs opacity-80">{texts.reviewDate}</p><p className="font-bold">{dateOf(selectedSlot.start_time)}</p></div>
              <div><p className="hand text-xs opacity-80">{texts.reviewTime}</p><p className="font-bold">{formatTime(selectedSlot.start_time)} – {formatTime(selectedSlot.end_time)}</p></div>
            </div>
            <button type="button" onClick={() => go(0)} className="btn-poster btn-paper btn-sm">{texts.modifyTime}</button>
          </div>
          {customerName.trim() ? (
            <div className="min-w-0 text-sm font-bold flex flex-col gap-1.5">
              <span>{texts.nameLabel}</span>
              <p className={`${input} bg-background-100`}>{customerName}</p>
            </div>
          ) : (
            <label className="min-w-0 text-sm font-bold flex flex-col gap-1.5">{texts.nameLabel}
              <input className={input} value={form.name} onChange={set('name')} placeholder={texts.namePlaceholder} required />
            </label>
          )}
          <label className="min-w-0 text-sm font-bold flex flex-col gap-1.5">{texts.phoneLabel}
            <input className={input} type="tel" value={form.phone} onChange={set('phone')} placeholder={texts.phonePlaceholder} required />
          </label>
          <label className="min-w-0 text-sm font-bold flex flex-col gap-1.5">{texts.partyLabel}
            <select className={input} value={form.party} onChange={set('party')}>
              {['1', '2', '3', '4', '5', '6', '7', '8'].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          {locations.length > 0 && (
            <label className="min-w-0 text-sm font-bold flex flex-col gap-1.5">{texts.locationLabel}
              <select className={input} value={form.location} onChange={set('location')}>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
          )}
          <label className="sm:col-span-2 min-w-0 text-sm font-bold flex flex-col gap-1.5">{texts.notesLabel}
            <textarea className={`${input} h-24 resize-none`} maxLength={500} value={form.notes} onChange={set('notes')} placeholder={texts.notesPlaceholder} />
          </label>
          {formError && <p className="sm:col-span-2 text-sm font-bold text-accent-600">{formError}</p>}
          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <button type="button" onClick={() => go(1)} className="btn-poster btn-paper btn-sm">{texts.back}</button>
            <button type="submit" disabled={submitting} className="btn-poster btn-berry btn-sm disabled:opacity-60">{submitting ? texts.submitting : texts.submit}</button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
}

export default BookingCalendar;