
-- Create prospects table
CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  rating TEXT NOT NULL DEFAULT '',
  review_count TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'Autre',
  status TEXT NOT NULL DEFAULT 'PROSPECT',
  demo_link TEXT NOT NULL DEFAULT '',
  proposed_price TEXT NOT NULL DEFAULT '',
  website_url TEXT NOT NULL DEFAULT '',
  renewal_date TEXT NOT NULL DEFAULT '',
  signed_date TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Allow all access (single user app, no auth)
CREATE POLICY "Allow all access to prospects" ON public.prospects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_activities_prospect_id ON public.activities(prospect_id);
CREATE INDEX idx_prospects_status ON public.prospects(status);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
