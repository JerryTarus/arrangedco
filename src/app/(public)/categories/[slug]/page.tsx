import { notFound } from "next/navigation";
import { categories } from "@/config/categories";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return buildMetadata({ noIndex: true });
  return buildMetadata({ title: cat.name, description: cat.description });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const supabase = await createClient();
  const { data: dbCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  const { data: posts } = dbCategory
    ? await supabase
        .from("posts")
        .select("id, title, slug, excerpt, featured_image, published_at, reading_time, category_id")
        .eq("status", "published")
        .eq("category_id", dbCategory.id)
        .order("published_at", { ascending: false })
    : { data: [] };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="text-4xl mb-3 block">{cat.emoji}</span>
        <h1 className="text-4xl font-bold font-playfair mb-2">{cat.name}</h1>
        <p className="text-muted-foreground">{cat.description}</p>
      </div>
      <CategoryFilter current={slug} />
      <ArticleGrid posts={posts ?? []} />
    </section>
  );
}
