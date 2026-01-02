-- Create flight_bookings table
CREATE TABLE IF NOT EXISTS public.flight_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  booking_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'PENDING',
  passenger_name_record TEXT NOT NULL,
  manual_passenger_name_record TEXT,
  departure_date TEXT NOT NULL,
  arrival_date TEXT NOT NULL,
  booked_date TEXT NOT NULL,
  detail JSONB NOT NULL,
  coupon_applied JSONB,
  handled_by UUID,
  booking_time TEXT,
  type TEXT NOT NULL DEFAULT 'ONLINE',
  issued_date TEXT,
  iata JSONB,
  cost_price NUMERIC DEFAULT 0,
  selling_price NUMERIC DEFAULT 0,
  profit NUMERIC DEFAULT 0,
  user_flight_additional_preference JSONB,
  total_passengers INTEGER NOT NULL,
  travel_class TEXT,
  booking_ticket_refundable_status TEXT,
  trip_type TEXT,
  manual_booking_id TEXT,
  flight_tickets JSONB,
  payment_status TEXT NOT NULL DEFAULT 'UNPAID',
  currency_code TEXT,
  currency_country TEXT,
  referral_code TEXT,
  client_origin TEXT,
  origin_airport JSONB,
  destination_airport JSONB,
  is_manual_fare_applied BOOLEAN DEFAULT FALSE,
  applied_manual_fares JSONB,
  is_archived BOOLEAN DEFAULT FALSE,
  origin TEXT,
  destination TEXT,
  arrival_time TEXT,
  departure_time TEXT,
  first_departure_airline JSONB,
  inquiry_id TEXT,
  is_group_fare_applied BOOLEAN DEFAULT FALSE,
  applied_group_fares JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON public.flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_booking_id ON public.flight_bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_status ON public.flight_bookings(status);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_created_at ON public.flight_bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_payment_status ON public.flight_bookings(payment_status);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_flight_bookings_updated_at ON public.flight_bookings;
CREATE TRIGGER update_flight_bookings_updated_at
  BEFORE UPDATE ON public.flight_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own bookings"
  ON public.flight_bookings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings"
  ON public.flight_bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.flight_bookings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON public.flight_bookings
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all bookings"
  ON public.flight_bookings
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE public.flight_bookings IS 'Stores flight booking information';
COMMENT ON COLUMN public.flight_bookings.booking_id IS 'Unique booking reference number';
COMMENT ON COLUMN public.flight_bookings.status IS 'Current status of the booking (PENDING, CONFIRMED, CANCELLED, etc.)';
COMMENT ON COLUMN public.flight_bookings.detail IS 'Detailed booking information in JSON format';
