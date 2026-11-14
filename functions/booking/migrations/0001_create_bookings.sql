CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name varchar(80) NOT NULL,
  customer_phone varchar(40) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  party_size smallint NOT NULL CHECK (party_size BETWEEN 1 AND 8),
  location varchar(120),
  notes text NOT NULL DEFAULT '',
  status varchar(16) NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'cancelled')),
  source varchar(16) NOT NULL DEFAULT 'website'
    CHECK (source IN ('website', 'staff')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

CREATE INDEX bookings_start_time_idx ON bookings (start_time);
