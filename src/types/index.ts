import type { Json } from "@/types/database";

export type Post = {
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

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  created_at: string;
};

export type AffiliateLink = {
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

export type Product = {
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

export type Author = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export type PaginationMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};
