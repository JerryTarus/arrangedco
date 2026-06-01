import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { buildMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Home organisation guides, product reviews, and lifestyle tips from Arranged Co.",
});

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, featured_image, published_at, reading_time, category_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(24);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-playfair mb-10">Blog</h1>
      <ArticleGrid posts={posts ?? []} />
    </section>
  );
}
