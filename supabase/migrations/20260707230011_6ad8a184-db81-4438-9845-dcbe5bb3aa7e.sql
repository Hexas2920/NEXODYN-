CREATE TABLE public.access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  role TEXT,
  delivery_interest TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.access_requests TO anon, authenticated;
GRANT ALL ON public.access_requests TO service_role;

ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an access request"
  ON public.access_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (organization IS NULL OR length(organization) <= 200)
    AND (role IS NULL OR length(role) <= 120)
    AND (delivery_interest IS NULL OR delivery_interest IN ('injection','inhalation','transdermal','all'))
    AND (message IS NULL OR length(message) <= 2000)
  );

CREATE INDEX idx_access_requests_created_at ON public.access_requests (created_at DESC);