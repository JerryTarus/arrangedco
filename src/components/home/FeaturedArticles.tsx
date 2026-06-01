import { createClient } from "@/lib/supabase/server";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import Link from "next/link";

export async function FeaturedArticles() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, featured_image, published_at, reading_time, category_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);

  if (!posts?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-playfair text-3xl font-bold">Latest guides</h2>
        <Link href="/blog" className="text-sm text-primary hover:underline">
          View all →
        </Link>
      </div>
      <ArticleGrid posts={posts} />
    </section>
  );
}
