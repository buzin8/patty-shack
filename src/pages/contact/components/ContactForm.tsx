import { useState } from 'react';
import type { FormEvent } from 'react';
import { bookingApiBase } from '@/mocks/booking';

const SUBMIT_URL = 'https://readdy.ai/api/form/dbleitesmf5femijub40';
const field = 'w-full box-border rounded-md border-[2.5px] border-foreground-950 bg-background-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const [count, setCount] = useState(0);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const trap = String(data.get('company_alt') || '').trim();
    if (trap) { setStatus('ok'); return; }
    data.delete('company_alt');
    const message = String(data.get('message') || '').trim();
    if (message.length > 500) { setFormError('Message must be 500 characters or less.'); setStatus('error'); return; }
    const params = new URLSearchParams();
    data.forEach((value, key) => params.append(key, String(value)));
    setStatus('sending');
    setFormError('');
    try {
      const databaseResponse = await fetch(`${bookingApiBase}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') || '').trim(),
          email: String(data.get('email') || '').trim(),
          topic: String(data.get('topic') || '').trim(),
          message,
        }),
      });
      if (!databaseResponse.ok) {
        const result: unknown = await databaseResponse.json().catch(() => null);
        const serverMessage = typeof result === 'object' && result !== null
          && 'error' in result && typeof result.error === 'string'
          ? result.error
          : 'Something went wrong. Please try again.';
        throw new Error(serverMessage);
      }

      let notificationFailed = false;
      try {
        const notificationResponse = await fetch(SUBMIT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });
        const notificationText = await notificationResponse.text();
        let notificationResult: { code?: string; message?: string; meta?: { message?: string } } | null = null;
        try { notificationResult = notificationText ? JSON.parse(notificationText) : null; } catch { notificationResult = null; }
        const notificationMessage = notificationResult?.meta?.message || notificationResult?.message || '';
        notificationFailed = !notificationResponse.ok
          || notificationResult?.code !== 'OK'
          || /spam/i.test(notificationMessage);
      } catch {
        notificationFailed = true;
      }

      setStatus('ok');
      form.reset();
      setCount(0);
      if (notificationFailed) {
        setFormError('Your message was saved, but the contact notification failed. Please call us if you need a reply soon.');
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <form id="contact-form" data-readdy-form onSubmit={onSubmit} className="poster-card hard-drop p-5 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
      <label className="min-w-0 flex flex-col gap-2 text-sm font-bold">Name
        <input name="name" required maxLength={80} className={field} placeholder="Your name" />
      </label>
      <label className="min-w-0 flex flex-col gap-2 text-sm font-bold">Email
        <input name="email" type="email" required maxLength={254} className={field} placeholder="you@email.com" />
      </label>
      <label className="min-w-0 sm:col-span-2 flex flex-col gap-2 text-sm font-bold">Topic
        <select name="topic" className={`${field} cursor-pointer`} defaultValue="General question">
          <option>General question</option>
          <option>Events &amp; catering</option>
          <option>Jobs at Patty Shack</option>
          <option>Press</option>
        </select>
      </label>
      <label className="min-w-0 sm:col-span-2 flex flex-col gap-2 text-sm font-bold">Message
        <textarea name="message" required rows={5} maxLength={500} onChange={(e) => setCount(e.target.value.length)} className={`${field} resize-none`} placeholder="Tell us what's up" />
        <span className="self-end text-xs font-normal text-foreground-600">{count}/500</span>
      </label>
      <input type="text" name="company_alt" className="fc-extra-field" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
        <button type="submit" disabled={status === 'sending'} className="btn-poster btn-berry disabled:opacity-60">
          {status === 'sending' ? 'Sending…' : 'Send message'} <i className="ri-send-plane-line" />
        </button>
        {status === 'ok' && (
          <p className="text-sm font-bold text-foreground-950">
            {formError || "Thanks! We'll get back to you soon."}
          </p>
        )}
        {status === 'error' && <p className="text-sm font-bold text-accent-600">{formError}</p>}
      </div>
    </form>
  );
}