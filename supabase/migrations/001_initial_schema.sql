-- =====================================================
-- holidayGo - Initial Database Schema
-- =====================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: profiles (colaboradores)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  department TEXT,
  hire_date DATE,
  status TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Férias', 'Pendente')),
  avatar_url TEXT,
  vacation_balance INTEGER DEFAULT 30,
  vacation_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- =====================================================
-- Table: vacations (férias planejadas)
-- =====================================================
CREATE TABLE IF NOT EXISTS vacations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vacation_date DATE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vacation_date)
);

-- Indexes for faster vacation lookups
CREATE INDEX IF NOT EXISTS idx_vacations_user_id ON vacations(user_id);
CREATE INDEX IF NOT EXISTS idx_vacations_year_month ON vacations(year, month);
CREATE INDEX IF NOT EXISTS idx_vacations_date ON vacations(vacation_date);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can read all profiles
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can update any profile (optional - for admin functionality)
-- Note: This requires an is_admin column or a separate admin check
-- CREATE POLICY "Admins can update any profile"
--   ON profiles FOR UPDATE
--   TO authenticated
--   USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

-- Enable RLS on vacations
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can read all vacations
CREATE POLICY "Vacations are viewable by authenticated users"
  ON vacations FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can insert their own vacations
CREATE POLICY "Users can insert their own vacations"
  ON vacations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own vacations
CREATE POLICY "Users can update their own vacations"
  ON vacations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own vacations
CREATE POLICY "Users can delete their own vacations"
  ON vacations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for vacations updated_at
CREATE TRIGGER update_vacations_updated_at
  BEFORE UPDATE ON vacations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Function to create profile on user signup
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, status, vacation_balance)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'Pendente',
    30
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- Function to update vacation_used count
-- =====================================================
CREATE OR REPLACE FUNCTION update_vacation_used()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET vacation_used = vacation_used + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles 
    SET vacation_used = vacation_used - 1
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update vacation_used
CREATE TRIGGER update_vacation_count
  AFTER INSERT OR DELETE ON vacations
  FOR EACH ROW
  EXECUTE FUNCTION update_vacation_used();





