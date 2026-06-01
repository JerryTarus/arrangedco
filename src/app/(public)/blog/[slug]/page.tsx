import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleHero } from "@/components/blog/ArticleHero";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("title, seo_description, og_image")
    .eq("slug", slug)
    .single();

  if (!data) return buildMetadata({ noIndex: true });

  return buildMetadata({
    title: data.title,
    description: data.seo_description ?? undefined,
    image: data.og_image ?? undefined,
    canonicalUrl: absoluteUrl(`/blog/${slug}`),
  });
}

export async function generateStaticParams() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <JsonLd type="article" post={post} />
      <ArticleHero post={post} />
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        <ArticleBody content={post.content} />
        <aside className="hidden lg:block">
          <TableOfContents content={post.content} />
        </aside>
      </div>
      <RelatedArticles categoryId={post.category_id} currentId={post.id} />
    </>
  );
}
