ALTER TABLE public.bookings
  ADD COLUMN customer_user_id uuid
  REFERENCES neon_auth."user"(id) ON DELETE SET NULL;

CREATE INDEX bookings_customer_user_start_idx
  ON public.bookings (customer_user_id, start_time);

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_no_overlapping_confirmed
  EXCLUDE USING gist (tstzrange(start_time, end_time, '[)') WITH &&)
  WHERE (status = 'confirmed');

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(80) NOT NULL,
  email varchar(254) NOT NULL,
  topic varchar(80) NOT NULL,
  message varchar(500) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX contact_messages_created_at_idx
  ON public.contact_messages (created_at DESC);
