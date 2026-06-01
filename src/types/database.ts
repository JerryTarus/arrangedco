// Hand-authored shape matching supabase/migrations/0001_initial_schema.sql
// Re-generate after migrations: npx supabase gen types typescript --local > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Row types ────────────────────────────────────────────────────────────────

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "editor" | "viewer";
  bio: string | null;
  created_at: string;
  updated_at: string;
};

type ProfileInsert = {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: "admin" | "editor" | "viewer";
  bio?: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: string | null;
  created_at: string;
};

type CategoryInsert = {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parent_id?: string | null;
};

type TagRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

type TagInsert = {
  name: string;
  slug: string;
};

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Json | null;
  featured_image: string | null;
  category_id: string | null;
  author_id: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  reading_time: number | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

type PostInsert = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: Json | null;
  featured_image?: string | null;
  category_id?: string | null;
  author_id?: string | null;
  status?: "draft" | "published" | "archived";
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image?: string | null;
  reading_time?: number | null;
  is_featured?: boolean;
};

type PostTagRow = {
  post_id: string;
  tag_id: string;
};

type PostTagInsert = {
  post_id: string;
  tag_id: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  price: number | null;
  compare_at_price: number | null;
  affiliate_link_id: string | null;
  category_id: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ProductInsert = {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  affiliate_link_id?: string | null;
  category_id?: string | null;
  is_featured?: boolean;
  sort_order?: number;
};

type PostProductRow = {
  post_id: string;
  product_id: string;
  sort_order: number;
};

type PostProductInsert = {
  post_id: string;
  product_id: string;
  sort_order?: number;
};

type AffiliateLinkRow = {
  id: string;
  slug: string;
  destination_url: string;
  product_name: string;
  product_image: string | null;
  price: number | null;
  merchant: string | null;
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
};

type AffiliateLinkInsert = {
  slug: string;
  destination_url: string;
  product_name: string;
  product_image?: string | null;
  price?: number | null;
  merchant?: string | null;
  is_active?: boolean;
};

type ClickEventRow = {
  id: string;
  link_id: string;
  ip_hash: string;
  user_agent: string;
  referer: string;
  country: string | null;
  created_at: string;
};

type ClickEventInsert = {
  link_id: string;
  ip_hash?: string;
  user_agent?: string;
  referer?: string;
  country?: string | null;
};

type NewsletterSubscriberRow = {
  id: string;
  email: string;
  status: "active" | "unsubscribed" | "pending";
  source: string | null;
  confirmed_at: string | null;
  created_at: string;
};

type NewsletterSubscriberInsert = {
  email: string;
  status?: "active" | "unsubscribed" | "pending";
  source?: string | null;
  confirmed_at?: string | null;
};

type MediaRow = {
  id: string;
  filename: string;
  url: string;
  storage_path: string;
  content_type: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  uploaded_by: string | null;
  created_at: string;
};

type MediaInsert = {
  filename: string;
  url: string;
  storage_path: string;
  content_type: string;
  size: number;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  uploaded_by?: string | null;
};

type SiteSettingRow = {
  key: string;
  value: Json;
  updated_at: string;
};

type SiteSettingInsert = {
  key: string;
  value: Json;
};

type SeoOverrideRow = {
  id: string;
  path: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  no_index: boolean;
  canonical_url: string | null;
  schema_markup: Json | null;
  updated_at: string;
};

type SeoOverrideInsert = {
  path: string;
  title?: string | null;
  description?: string | null;
  og_image?: string | null;
  no_index?: boolean;
  canonical_url?: string | null;
  schema_markup?: Json | null;
};

// ─── Database shape ────────────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: Partial<CategoryInsert>;
        Relationships: [];
      };
      tags: {
        Row: TagRow;
        Insert: TagInsert;
        Update: Partial<TagInsert>;
        Relationships: [];
      };
      posts: {
        Row: PostRow;
        Insert: PostInsert;
        Update: Partial<PostInsert>;
        Relationships: [];
      };
      post_tags: {
        Row: PostTagRow;
        Insert: PostTagInsert;
        Update: Partial<PostTagInsert>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: Partial<ProductInsert>;
        Relationships: [];
      };
      post_products: {
        Row: PostProductRow;
        Insert: PostProductInsert;
        Update: Partial<PostProductInsert>;
        Relationships: [];
      };
      affiliate_links: {
        Row: AffiliateLinkRow;
        Insert: AffiliateLinkInsert;
        Update: Partial<AffiliateLinkInsert>;
        Relationships: [];
      };
      click_events: {
        Row: ClickEventRow;
        Insert: ClickEventInsert;
        Update: Partial<ClickEventInsert>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: NewsletterSubscriberInsert;
        Update: Partial<NewsletterSubscriberInsert>;
        Relationships: [];
      };
      media: {
        Row: MediaRow;
        Insert: MediaInsert;
        Update: Partial<MediaInsert>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: SiteSettingInsert;
        Update: Partial<SiteSettingInsert>;
        Relationships: [];
      };
      seo_overrides: {
        Row: SeoOverrideRow;
        Insert: SeoOverrideInsert;
        Update: Partial<SeoOverrideInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      post_status: "draft" | "published" | "archived";
      user_role: "admin" | "editor" | "viewer";
      subscriber_status: "active" | "unsubscribed" | "pending";
    };
    CompositeTypes: Record<string, never>;
  };
};

// ─── Convenience re-exports ────────────────────────────────────────────────────

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
