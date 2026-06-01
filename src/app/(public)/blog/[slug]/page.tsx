import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createDirectClient } from "@supabase/supabase-js";
import { ArticleHero } from "@/components/blog/ArticleHero";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import type { Json } from "@/types/database";
import type { Post } from "@/types";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

// Shape returned by the joined Supabase query
type ArticlePost = {
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
  categories: { name: string; slug: string } | null;
};

// Build the dynamic OG image URL; used when the post has no custom og_image
function buildOgUrl(title: string, category?: string | null): string {
  const params = new URLSearchParams({ title });
  if (category) params.set("category", category);
  return absoluteUrl(`/api/og?${params.toString()}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return buildMetadata({ noIndex: true });
  }
  const supabase = await createClient();
  const result = await supabase
    .from("posts")
    .select("title, seo_description, og_image, categories(name)")
    .eq("slug", slug)
    .single();

  type MetaRow = {
    title: string;
    seo_description: string | null;
    og_image: string | null;
    categories: { name: string } | null;
  };
  const data = result.data as MetaRow | null;
  if (!data) return buildMetadata({ noIndex: true });

  const categoryName = data.categories?.name ?? null;

  // Prefer a manually-set og_image; fall back to the dynamic /api/og endpoint
  const ogImage = data.og_image ?? buildOgUrl(data.title, categoryName);

  return buildMetadata({
    title: data.title,
    description: data.seo_description ?? undefined,
    image: ogImage,
    canonicalUrl: absoluteUrl(`/blog/${slug}`),
  });
}

export async function generateStaticParams() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  // Cookie-free direct client — generateStaticParams has no request context
  const supabase = createDirectClient(url, key);
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    notFound();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  const post = data as ArticlePost | null;
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <JsonLd type="article" post={post as unknown as Post} />

      <ArticleHero
        post={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          featured_image: post.featured_image,
          published_at: post.published_at,
          reading_time: post.reading_time,
          categories: post.categories,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 py-10 lg:grid-cols-[1fr_260px]">
          {/* ── Article body ── */}
          <ArticleBody content={post.content} />

          {/* ── Sticky TOC (desktop) ── */}
          <aside className="hidden lg:block">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </div>

      <RelatedArticles categoryId={post.category_id} currentId={post.id} />
    </>
  );
}
