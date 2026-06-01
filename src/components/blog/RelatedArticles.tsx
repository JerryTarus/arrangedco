import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  reading_time: number | null;
};

type Props = { categoryId: string | null; currentId: string };

export async function RelatedArticles({ categoryId, currentId }: Props) {
  if (!categoryId) return null;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  let posts: RelatedPost[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, featured_image, published_at, reading_time")
      .eq("status", "published")
      .eq("category_id", categoryId)
      .neq("id", currentId)
      .order("published_at", { ascending: false })
      .limit(3);
    posts = (data as RelatedPost[] | null) ?? [];
  } catch {
    return null;
  }

  if (!posts.length) return null;

  return (
    <section className="border-t border-ink/[0.08] bg-[#FAF8F5] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Related articles
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow duration-300 hover:shadow-lg"
            >
              {/* Image area */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#F5EEE8] to-[#EDE8E2]">
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-terracotta/20" />
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-5">
                {post.reading_time && (
                  <div className="mb-2.5 flex items-center gap-1.5 text-ink/40">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-xs">{post.reading_time} min read</span>
                  </div>
                )}
                <h3 className="font-serif text-[1.05rem] font-semibold leading-snug text-ink transition-colors duration-150 group-hover:text-terracotta line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/55 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                {post.published_at && (
                  <time className="mt-4 block text-xs text-ink/35">
                    {formatDate(post.published_at)}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
