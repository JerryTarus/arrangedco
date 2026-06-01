-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts
CREATE TABLE public.posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,
  content         JSONB,
  featured_image  TEXT,
  category_id     UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at    TIMESTAMPTZ,
  seo_title       TEXT,
  seo_description TEXT,
  og_image        TEXT,
  reading_time    INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Affiliate links
CREATE TABLE public.affiliate_links (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  destination_url TEXT NOT NULL,
  product_name    TEXT NOT NULL,
  product_image   TEXT,
  price           NUMERIC(10,2),
  merchant        TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  click_count     INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link clicks (analytics)
CREATE TABLE public.link_clicks (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id    UUID NOT NULL REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  ip_hash    TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  referer    TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE public.products (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  image            TEXT,
  price            NUMERIC(10,2),
  affiliate_link_id UUID REFERENCES public.affiliate_links(id) ON DELETE SET NULL,
  category_id      UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER affiliate_links_updated_at
  BEFORE UPDATE ON public.affiliate_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Increment click_count on insert
CREATE OR REPLACE FUNCTION public.increment_link_clicks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.affiliate_links
  SET click_count = click_count + 1
  WHERE id = NEW.link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_link_click
  AFTER INSERT ON public.link_clicks
  FOR EACH ROW EXECUTE FUNCTION public.increment_link_clicks();

-- Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published posts"
  ON public.posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can read categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Public can read active affiliate links"
  ON public.affiliate_links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read products"
  ON public.products FOR SELECT
  USING (true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins full access posts"
  ON public.posts FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access categories"
  ON public.categories FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access affiliate_links"
  ON public.affiliate_links FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access products"
  ON public.products FOR ALL
  USING (auth.role() = 'authenticated');

-- Anyone can insert link clicks (tracking)
CREATE POLICY "Anyone can track clicks"
  ON public.link_clicks FOR INSERT
  WITH CHECK (true);
