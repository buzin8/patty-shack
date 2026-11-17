import { useMemo, useState } from 'react';

export interface PickerSlot {
  start_time: string;
  end_time: string;
}

interface Props {
  slots: PickerSlot[];
  value: PickerSlot | null;
  onChange: (slot: PickerSlot | null) => void;
  loading?: boolean;
  error?: string;
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (n: number) => String(n).padStart(2, '0');
const dateOf = (value: string) => value.slice(0, 10);
const ymOf = (date: string) => date.slice(0, 7);

function formatTime(value: string) {
  const match = value.match(/[ T](\d{2}):(\d{2})/);
  if (!match) return value;
  const hour = Number(match[1]);
  return `${hour % 12 || 12}:${match[2]} ${hour < 12 ? 'AM' : 'PM'}`;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function SlotPicker({ slots, value, onChange, loading = false, error = '' }: Props) {
  const today = todayStr();
  const [viewYm, setViewYm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showTimes, setShowTimes] = useState(false);

  const byDate = useMemo(() => {
    const map = new Map<string, PickerSlot[]>();
    slots.forEach((slot) => {
      const date = dateOf(slot.start_time);
      if (date < today) return;
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(slot);
    });
    map.forEach((list) => list.sort((a, b) => a.start_time.localeCompare(b.start_time)));
    return map;
  }, [slots, today]);

  const dates = useMemo(() => Array.from(byDate.keys()).sort(), [byDate]);

  const activeYm = viewYm
    || (value ? ymOf(dateOf(value.start_time)) : dates.length ? ymOf(dates[0]) : '');
  const [year, month] = activeYm ? activeYm.split('-').map(Number) : [0, 0];
  const minYm = dates.length ? ymOf(dates[0]) : '';
  const maxYm = dates.length ? ymOf(dates[dates.length - 1]) : '';

  const grid = useMemo(() => {
    if (!activeYm) return [];
    const [y, m] = activeYm.split('-').map(Number);
    const first = new Date(y, m - 1, 1).getDay();
    const total = new Date(y, m, 0).getDate();
    const cells: (string | null)[] = Array(first).fill(null);
    for (let d = 1; d <= total; d += 1) cells.push(`${activeYm}-${pad(d)}`);
    while (cells.length % 7) cells.push(null);
    return cells;
  }, [activeYm]);

  function shiftMonth(delta: number) {
    const d = new Date(year, month - 1 + delta, 1);
    setViewYm(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
  }

  if (loading) return <p className="hand py-6 text-center text-lg">Loading open times…</p>;
  if (error) return <p className="py-4 text-sm text-red-700" role="alert">{error}</p>;
  if (!dates.length) return <p className="py-4 text-sm">No open times right now.</p>;

  return (
    <div>
      {!showTimes ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              disabled={activeYm <= minYm}
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-foreground-950 transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
            <p className="h-card !text-[22px]">{MONTHS[month - 1]} {year}</p>
            <button
              type="button"
              disabled={activeYm >= maxYm}
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-foreground-950 transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <i className="ri-arrow-right-s-line text-xl" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {grid.map((date, i) => {
              if (!date) return <span key={`e${i}`} />;
              const ok = byDate.has(date);
              const selected = value ? dateOf(value.start_time) === date : false;
              return (
                <button
                  key={date}
                  type="button"
                  disabled={!ok}
                  onClick={() => { setSelectedDate(date); setShowTimes(true); }}
                  className={`flex flex-col items-center justify-center rounded-md border-[2px] py-2 transition-colors ${
                    selected
                      ? 'cursor-pointer border-foreground-950 bg-accent-500 text-background-50'
                      : ok
                        ? 'cursor-pointer border-foreground-950 bg-primary-100 hover:bg-primary-500'
                        : 'cursor-not-allowed border-transparent text-foreground-300'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider">{WEEKDAYS[i % 7]}</span>
                  <span className="text-sm font-bold md:text-base">{Number(date.slice(8))}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <p className="hand mb-4 text-lg">Open times on {selectedDate}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(byDate.get(selectedDate) || []).map((slot) => (
              <button
                key={slot.start_time}
                type="button"
                onClick={() => onChange(slot)}
                className={`cursor-pointer whitespace-nowrap rounded-md border-[2.5px] border-foreground-950 px-3 py-3 text-sm font-bold transition-colors ${
                  value?.start_time === slot.start_time
                    ? 'bg-accent-500 text-background-50'
                    : 'bg-background-50 hover:bg-primary-500'
                }`}
              >
                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setShowTimes(false)} className="btn-poster btn-paper btn-sm mt-5">
            Change day
          </button>
        </div>
      )}

      {value && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-secondary-500 p-3 text-background-50">
          <p className="text-sm font-bold">
            New time: {dateOf(value.start_time)}, {formatTime(value.start_time)} – {formatTime(value.end_time)}
          </p>
          <button
            type="button"
            onClick={() => { onChange(null); setShowTimes(false); }}
            className="btn-poster btn-paper btn-sm"
          >
            Keep current time
          </button>
        </div>
      )}
    </div>
  );
}