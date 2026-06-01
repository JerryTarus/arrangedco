import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { categories as configCategories } from "@/config/categories";
import { getGradient } from "@/config/gradients";
import { Pagination } from "@/components/blog/Pagination";
import { NewsletterSidebar } from "@/components/newsletter/NewsletterSidebar";
import { buildMetadata } from "@/lib/seo";
import { cn, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

const POSTS_PER_PAGE = 12;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

// ── Static params from config (covers all valid category slugs) ───────────
export function generateStaticParams() {
  return configCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = configCategories.find((c) => c.slug === slug);
  if (!cat) return buildMetadata({ noIndex: true });
  return buildMetadata({ title: cat.name, description: cat.description });
}

// ── Local types ───────────────────────────────────────────────────────────
type PostCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  reading_time: number | null;
  is_featured: boolean;
};

type PopularPost = {
  id: string;
  title: string;
  slug: string;
  featured_image: string | null;
  reading_time: number | null;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
  emoji: string | undefined;
  count: number;
};

// ── Page ──────────────────────────────────────────────────────────────────
export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const configCat = configCategories.find((c) => c.slug === slug);
  if (!configCat) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (page - 1) * POSTS_PER_PAGE;
  const gradient = getGradient(slug);
  const supabaseReady =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Initialise with safe defaults (shown when Supabase is unconfigured)
  let dbCategoryId: string | null = null;
  let dbCategoryImage: string | null = null;
  let totalCount = 0;
  let posts: PostCard[] = [];
  let popularPosts: PopularPost[] = [];
  let collections: Collection[] = [];

  if (supabaseReady) {
    try {
      const supabase = await createClient();

      // Round 1 — category row + all categories list (independent of each other)
      const [catResult, allCatsResult] = await Promise.all([
        supabase
          .from("categories")
          .select("id, name, slug, image")
          .eq("slug", slug)
          .single(),
        supabase.from("categories").select("id, name, slug"),
      ]);

      if (catResult.data) {
        dbCategoryId = catResult.data.id;
        dbCategoryImage = catResult.data.image ?? null;
      }

      if (dbCategoryId) {
        const catId = dbCategoryId;

        // Round 2 — all posts queries in parallel (require catId from round 1)
        const [countResult, postsResult, popularResult, postCountsResult] =
          await Promise.all([
            // Total count for pagination maths
            supabase
              .from("posts")
              .select("*", { count: "exact", head: true })
              .eq("status", "published")
              .eq("category_id", catId),

            // Current page of posts
            supabase
              .from("posts")
              .select(
                "id, title, slug, excerpt, featured_image, published_at, reading_time, is_featured",
              )
              .eq("status", "published")
              .eq("category_id", catId)
              .order("published_at", { ascending: false })
              .range(offset, offset + POSTS_PER_PAGE - 1),

            // Popular sidebar: featured posts in this category
            supabase
              .from("posts")
              .select("id, title, slug, featured_image, reading_time")
              .eq("status", "published")
              .eq("category_id", catId)
              .eq("is_featured", true)
              .limit(3),

            // All published post category_ids for count map
            supabase
              .from("posts")
              .select("category_id")
              .eq("status", "published")
              .not("category_id", "is", null),
          ]);

        totalCount = countResult.count ?? 0;
        posts = (postsResult.data ?? []) as PostCard[];
        popularPosts = (popularResult.data ?? []) as PopularPost[];

        // Build count map for "All Collections" sidebar
        const countMap: Record<string, number> = {};
        for (const p of postCountsResult.data ?? []) {
          if (p.category_id)
            countMap[p.category_id] = (countMap[p.category_id] ?? 0) + 1;
        }

        collections = (allCatsResult.data ?? []).map((dbCat) => {
          const cc = configCategories.find((c) => c.slug === dbCat.slug);
          return {
            id: dbCat.id,
            name: dbCat.name,
            slug: dbCat.slug,
            emoji: cc?.emoji,
            count: countMap[dbCat.id] ?? 0,
          };
        });
      }
    } catch {
      // Supabase unavailable — page renders with empty posts state
    }
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="bg-[#FAF8F5]">
      {/* ── Category header ── */}
      <div className="relative overflow-hidden">
        {dbCategoryImage ? (
          <div className="relative h-60 w-full sm:h-72">
            <Image
              src={dbCategoryImage}
              alt={configCat.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/30 to-transparent" />
          </div>
        ) : (
          <div className={cn("h-48 w-full bg-gradient-to-br sm:h-56", gradient)} />
        )}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={cn(dbCategoryImage ? "-mt-16" : "pt-8", "pb-8")}>
            {/* Breadcrumb */}
            <nav className="mb-3 flex items-center gap-1.5 text-xs text-ink/40">
              <Link
                href="/categories"
                className="transition-colors hover:text-terracotta"
              >
                Collections
              </Link>
              <span>/</span>
              <span className="text-ink/65">{configCat.name}</span>
            </nav>

            <div className="flex items-start gap-4">
              <span
                className="shrink-0 text-4xl leading-none sm:text-5xl"
                aria-hidden
              >
                {configCat.emoji}
              </span>
              <div>
                <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
                  {configCat.name}
                </h1>
                <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-ink/55">
                  {configCat.description}
                </p>
                {totalCount > 0 && (
                  <span className="mt-3 inline-flex rounded-full bg-terracotta/[0.09] px-3 py-1 text-sm font-medium text-terracotta">
                    {totalCount}{" "}
                    {totalCount === 1 ? "article" : "articles"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* ── Filter pills (cross-category navigation) ── */}
        <div className="mb-8 flex flex-wrap gap-2">
          {configCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                c.slug === slug
                  ? "bg-terracotta text-white shadow-sm"
                  : "border border-ink/[0.10] bg-white text-ink/60 shadow-card hover:border-terracotta/40 hover:text-terracotta",
              )}
            >
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>

        {/* ── Two-column layout: 70 / 30 ── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
          {/* ── Left: article grid + pagination ── */}
          <section aria-label={`${configCat.name} articles`}>
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/[0.12] bg-white/60 py-20 text-center">
                <span className="text-5xl" aria-hidden>
                  {configCat.emoji}
                </span>
                <p className="mt-4 font-serif text-lg font-medium text-ink/50">
                  No articles yet
                </p>
                <p className="mt-1 text-sm text-ink/35">
                  Check back soon — we&apos;re working on it.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow duration-300 hover:shadow-lg"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {post.featured_image ? (
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 35vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div
                            className={cn(
                              "h-full w-full bg-gradient-to-br",
                              gradient,
                            )}
                          />
                        )}
                        {post.is_featured && (
                          <span className="absolute left-3 top-3 rounded-full bg-terracotta px-2.5 py-0.5 text-[11px] font-semibold text-white">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-4">
                        <h2 className="font-serif text-[1rem] font-semibold leading-snug text-ink transition-colors duration-150 group-hover:text-terracotta line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/55 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-3">
                          {post.reading_time && (
                            <span className="flex items-center gap-1 text-xs text-ink/40">
                              <Clock className="h-3 w-3 shrink-0" />
                              {post.reading_time} min
                            </span>
                          )}
                          {post.published_at && (
                            <time className="text-xs text-ink/35">
                              {formatDate(post.published_at)}
                            </time>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  basePath={`/categories/${slug}`}
                />
              </>
            )}
          </section>

          {/* ── Right: sidebar ── */}
          <aside className="space-y-5 lg:sticky lg:top-[96px] lg:self-start">

            {/* Popular in this category */}
            {popularPosts.length > 0 && (
              <div className="rounded-2xl bg-white p-5 shadow-card">
                <h3 className="mb-4 font-serif text-[0.95rem] font-semibold text-ink">
                  Popular in {configCat.name}
                </h3>
                <ul className="space-y-4">
                  {popularPosts.map((p) => (
                    <li key={p.id}>
                      <Link href={`/blog/${p.slug}`} className="flex gap-3 group">
                        {/* Thumbnail */}
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                          {p.featured_image ? (
                            <Image
                              src={p.featured_image}
                              alt={p.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div
                              className={cn(
                                "h-full w-full bg-gradient-to-br",
                                gradient,
                              )}
                            />
                          )}
                        </div>
                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 font-serif text-sm font-medium leading-snug text-ink transition-colors group-hover:text-terracotta">
                            {p.title}
                          </p>
                          {p.reading_time && (
                            <p className="mt-0.5 text-[11px] text-ink/40">
                              {p.reading_time} min read
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* All Collections */}
            {collections.length > 0 && (
              <div className="rounded-2xl bg-white p-5 shadow-card">
                <h3 className="mb-3 font-serif text-[0.95rem] font-semibold text-ink">
                  All Collections
                </h3>
                <ul className="space-y-0.5">
                  {collections.map((col) => (
                    <li key={col.id}>
                      <Link
                        href={`/categories/${col.slug}`}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                          col.slug === slug
                            ? "bg-terracotta/[0.08] font-medium text-terracotta"
                            : "text-ink/65 hover:bg-ink/[0.04] hover:text-ink",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {col.emoji && (
                            <span aria-hidden>{col.emoji}</span>
                          )}
                          {col.name}
                        </span>
                        {col.count > 0 && (
                          <span className="tabular-nums text-xs text-ink/35">
                            {col.count}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Newsletter */}
            <NewsletterSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
