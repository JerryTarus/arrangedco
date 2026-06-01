-- RPC called by the affiliate redirect route (/api/go/[slug]).
-- Runs as the postgres superuser (SECURITY DEFINER) so the anon key
-- can execute it without needing direct UPDATE on affiliate_links.
CREATE OR REPLACE FUNCTION public.increment_click(
  p_link_id   UUID,
  p_ip_hash   TEXT DEFAULT '',
  p_user_agent TEXT DEFAULT '',
  p_referer   TEXT DEFAULT ''
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Increment the denormalised counter on the link itself
  UPDATE public.affiliate_links
  SET click_count = click_count + 1
  WHERE id = p_link_id AND is_active = true;

  -- Record the individual click event for analytics
  INSERT INTO public.click_events (link_id, ip_hash, user_agent, referer)
  VALUES (p_link_id, p_ip_hash, p_user_agent, p_referer);
END;
$$;

-- Allow authenticated and anonymous callers to execute this function
GRANT EXECUTE ON FUNCTION public.increment_click(UUID, TEXT, TEXT, TEXT)
  TO anon, authenticated;

-- ── newsletter_subscribers ────────────────────────────────────────────────
-- Create the table if it wasn't part of the initial schema migration.
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        TEXT NOT NULL UNIQUE,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('active', 'unsubscribed', 'pending')),
  source       TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone may subscribe (INSERT only — no read/update/delete for anon)
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Authenticated users (admins) get full access
CREATE POLICY "Admins full access newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR ALL
  USING (auth.role() = 'authenticated');
