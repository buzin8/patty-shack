import { useState } from 'react';
import PageShell from '@/components/feature/PageShell';
import PageHero from '@/components/feature/PageHero';
import BookingCalendar from '@/components/feature/BookingCalendar';
import CustomerAccountPanel from '@/components/feature/CustomerAccountPanel';
import { contactInfo } from '@/mocks/pages';
import { locations } from '@/mocks/locations';
import { bookingTimeslotsApi, bookingAppointmentsApi, bookingTexts } from '@/mocks/booking';
import ContactForm from './components/ContactForm';

export default function ContactPage() {
  const [customerName, setCustomerName] = useState('');

  return (
    <PageShell title="Contact Patty Shack | Infinity Benchmark near RDB Cinema, Sector V">
      <PageHero
        sticker="say hi"
        title={<>Talk to the <span className="text-accent-500">Shack.</span></>}
        intro={<>Questions, parties, catering or just a burger opinion — <span className="hand text-accent-500 text-xl">we read it all.</span></>}
      />
      <section id="book" className="wrap pt-14 md:pt-20 scroll-mt-[90px] grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <span className="sticker bg-accent-500 text-background-50 tilt-l">book a table</span>
          <h2 className="h-section mt-6">Save your <span className="text-accent-500">seat.</span></h2>
          <p className="mt-4 leading-[1.7]">
            We will have the grill hot at Patty Shack.
          </p>
        </div>
        <div className="lg:col-span-8 min-w-0">
          <CustomerAccountPanel onCustomerNameChange={setCustomerName} />
          <BookingCalendar
            timeslotsApi={bookingTimeslotsApi}
            appointmentsApi={bookingAppointmentsApi}
            texts={bookingTexts}
            locations={locations.map((l) => l.name)}
            customerName={customerName}
          />
        </div>
      </section>
      <section className="wrap py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 flex flex-col gap-4">
          {contactInfo.map((c) => (
            <div key={c.label} className="poster-card p-5 flex items-center gap-4">
              <span className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-500 border-[2.5px] border-foreground-950 shrink-0">
                <i className={`${c.icon} text-xl`} />
              </span>
              <div>
                <p className="hand text-sm text-foreground-600">{c.label}</p>
                <p className="font-bold text-sm md:text-base leading-snug">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-8 min-w-0">
          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}
