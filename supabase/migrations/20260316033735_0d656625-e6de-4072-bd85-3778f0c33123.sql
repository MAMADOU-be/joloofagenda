
-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add user_id to prospects
ALTER TABLE public.prospects ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to activities
ALTER TABLE public.activities ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Appointments table
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prospect_id uuid REFERENCES public.prospects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  date timestamp with time zone NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  location text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own appointments" ON public.appointments
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Update prospects RLS: drop old open policy, add user-scoped + allow null user_id for migration
DROP POLICY IF EXISTS "Allow all access to prospects" ON public.prospects;

CREATE POLICY "Users manage own prospects" ON public.prospects
  FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id);

-- Update activities RLS
DROP POLICY IF EXISTS "Allow all access to activities" ON public.activities;

CREATE POLICY "Users manage own activities" ON public.activities
  FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at on appointments
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
