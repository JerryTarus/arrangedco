-- Add is_featured to posts (present in database.ts types but missing from initial schema)
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Partial index for efficiently querying featured posts
CREATE INDEX IF NOT EXISTS idx_posts_is_featured
  ON public.posts(is_featured)
  WHERE is_featured = TRUE;

-- Add parent_id to categories (present in database.ts types but missing from initial schema)
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Profiles table (mirrors auth.users with extra display fields)
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  full_name  TEXT,
  avatar_url TEXT,
  role       TEXT NOT NULL DEFAULT 'viewer'
             CHECK (role IN ('admin', 'editor', 'viewer')),
  bio        TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tags"
  ON public.tags FOR SELECT USING (true);

CREATE POLICY "Admins full access tags"
  ON public.tags FOR ALL USING (auth.role() = 'authenticated');

-- Post-tags junction
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id  UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read post_tags"
  ON public.post_tags FOR SELECT USING (true);

CREATE POLICY "Admins full access post_tags"
  ON public.post_tags FOR ALL USING (auth.role() = 'authenticated');

-- Post-products junction
CREATE TABLE IF NOT EXISTS public.post_products (
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (post_id, product_id)
);

ALTER TABLE public.post_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read post_products"
  ON public.post_products FOR SELECT USING (true);

CREATE POLICY "Admins full access post_products"
  ON public.post_products FOR ALL USING (auth.role() = 'authenticated');

-- Media table
CREATE TABLE IF NOT EXISTS public.media (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename     TEXT NOT NULL,
  url          TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size         INT NOT NULL,
  width        INT,
  height       INT,
  alt          TEXT,
  uploaded_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read media"
  ON public.media FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access media"
  ON public.media FOR ALL USING (auth.role() = 'authenticated');

-- Site settings key-value store
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access site_settings"
  ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- SEO overrides
CREATE TABLE IF NOT EXISTS public.seo_overrides (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path          TEXT NOT NULL UNIQUE,
  title         TEXT,
  description   TEXT,
  og_image      TEXT,
  no_index      BOOLEAN NOT NULL DEFAULT FALSE,
  canonical_url TEXT,
  schema_markup JSONB,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.seo_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access seo_overrides"
  ON public.seo_overrides FOR ALL USING (auth.role() = 'authenticated');
