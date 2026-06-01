// Auto-generated shape. Re-run after migrations:
// npx supabase gen types typescript --local > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  created_at: string;
};

type CategoryInsert = {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
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

type LinkClickRow = {
  id: string;
  link_id: string;
  ip_hash: string;
  user_agent: string;
  referer: string;
  created_at: string;
};

type LinkClickInsert = {
  link_id: string;
  ip_hash?: string;
  user_agent?: string;
  referer?: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  price: number | null;
  affiliate_link_id: string | null;
  category_id: string | null;
  is_featured: boolean;
  created_at: string;
};

type ProductInsert = {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  price?: number | null;
  affiliate_link_id?: string | null;
  category_id?: string | null;
  is_featured?: boolean;
};

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: PostRow;
        Insert: PostInsert;
        Update: Partial<PostInsert>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: Partial<CategoryInsert>;
        Relationships: [];
      };
      affiliate_links: {
        Row: AffiliateLinkRow;
        Insert: AffiliateLinkInsert;
        Update: Partial<AffiliateLinkInsert>;
        Relationships: [];
      };
      link_clicks: {
        Row: LinkClickRow;
        Insert: LinkClickInsert;
        Update: Partial<LinkClickInsert>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: Partial<ProductInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
