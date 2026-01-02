# Quick Setup Guide - User Passengers Table

## Option 1: Manual SQL (Fastest - 2 minutes) ✅ RECOMMENDED

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/qpyqqjaunvmospopytxw)
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy and paste this SQL:

```sql
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

CREATE INDEX IF NOT EXISTS idx_user_passengers_user_id ON public.user_passengers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_passengers_created_at ON public.user_passengers(created_at);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_passengers_updated_at ON public.user_passengers;
CREATE TRIGGER update_user_passengers_updated_at
  BEFORE UPDATE ON public.user_passengers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

5. Click **Run** (or press Ctrl+Enter)
6. Done! Restart your NestJS app

---

## Option 2: Automatic Migrations (Requires DB Password)

### Step 1: Get Your Database Password

1. Go to [Supabase Dashboard → Settings → Database](https://supabase.com/dashboard/project/qpyqqjaunvmospopytxw/settings/database)
2. Scroll to **Connection String** section
3. Copy the **Connection String** (URI format)
   - OR click **Reset Database Password** if you don't have it

### Step 2: Update .env File

Replace this line in your `.env`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.qpyqqjaunvmospopytxw.supabase.co:5432/postgres
```

With the actual connection string from Supabase (it will look like):

```env
DATABASE_URL=postgresql://postgres:your-actual-password-here@db.qpyqqjaunvmospopytxw.supabase.co:5432/postgres
```

### Step 3: Restart App

```bash
yarn start:dev
```

The migration will run automatically!

---

## Verify Table Creation

After running either option, verify the table exists:

1. Go to **Table Editor** in Supabase
2. You should see `user_passengers` table
3. Try creating a passenger via your API:

```bash
POST http://localhost:3000/user-passenger
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "first_name": "John",
  "last_name": "Doe",
  "relationship": "Self",
  "date_of_birth": "1990-01-01",
  "gender": "MALE",
  "country": "USA"
}
```

---

**Recommendation:** Use **Option 1** (manual SQL) - it's faster and doesn't require exposing your database password.
