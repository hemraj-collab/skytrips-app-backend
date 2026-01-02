-- Create user_passengers table
CREATE TABLE IF NOT EXISTS public.user_passengers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
  country TEXT NOT NULL,
  meal_preference TEXT,
  special_assistance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_passengers_user_id ON public.user_passengers(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_user_passengers_created_at ON public.user_passengers(created_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_passengers_updated_at ON public.user_passengers;
CREATE TRIGGER update_user_passengers_updated_at
  BEFORE UPDATE ON public.user_passengers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE public.user_passengers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own passengers
CREATE POLICY "Users can view their own passengers"
  ON public.user_passengers
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own passengers
CREATE POLICY "Users can insert their own passengers"
  ON public.user_passengers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own passengers
CREATE POLICY "Users can update their own passengers"
  ON public.user_passengers
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own passengers
CREATE POLICY "Users can delete their own passengers"
  ON public.user_passengers
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow service role to bypass RLS for admin operations
CREATE POLICY "Service role can manage all passengers"
  ON public.user_passengers
  FOR ALL
  USING (auth.role() = 'service_role');
