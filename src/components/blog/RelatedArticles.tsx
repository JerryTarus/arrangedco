import { createClient } from "@/lib/supabase/server";
import { ArticleGrid } from "./ArticleGrid";

type Props = { categoryId: string | null; currentId: string };

export async function RelatedArticles({ categoryId, currentId }: Props) {
  if (!categoryId) return null;

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, featured_image, published_at, reading_time, category_id")
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", currentId)
    .limit(3);

  if (!posts?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 border-t">
      <h2 className="font-playfair text-2xl font-bold mb-8">Related articles</h2>
      <ArticleGrid posts={posts} />
    </section>
  );
}
