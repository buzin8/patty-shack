export const bookingApiBase = (import.meta.env.VITE_BOOKING_API_URL || '/api/booking').replace(/\/+$/, '');

export const bookingTimeslotsApi = `${bookingApiBase}/timeslots`;

export const bookingAppointmentsApi = `${bookingApiBase}/appointments`;

export const bookingTexts = {
  stepDate: '1 · Pick a day',
  stepTime: '2 · Pick a time',
  stepDetails: '3 · Your details',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  loading: 'Firing up the calendar…',
  loadError: 'We could not load open tables right now.',
  retry: 'Try again',
  noSlots: 'No open tables right now — check back soon.',
  slotsFor: 'Open times on',
  back: 'Back',
  reviewTitle: 'Your table',
  reviewDate: 'Date',
  reviewTime: 'Time',
  modifyTime: 'Modify time',
  nameLabel: 'Your name *',
  namePlaceholder: 'Rahul Sharma',
  phoneLabel: 'Phone *',
  phonePlaceholder: '+91 98746 81046',
  partyLabel: 'Party size',
  locationLabel: 'Location',
  notesLabel: 'Anything we should know?',
  notesPlaceholder: 'Birthday celebration, extra Shack sauce, outdoor seating…',
  submit: 'Book my table',
  submitting: 'Booking…',
  required: 'Please add your name and phone number.',
  submitError: 'Booking failed. Please try again.',
  successTitle: 'You are booked!',
  successBody: 'See you at Infinity Benchmark, Ground Floor, near RDB Cinema. We will call if anything changes.',
  bookAnother: 'Book another table',
};
