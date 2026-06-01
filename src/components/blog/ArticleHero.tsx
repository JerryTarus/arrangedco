import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

type CategoryRef = { name: string; slug: string } | null;

export type ArticleHeroPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  reading_time: number | null;
  categories?: CategoryRef;
};

type Props = { post: ArticleHeroPost };

export function ArticleHero({ post }: Props) {
  const category = post.categories ?? null;

  return (
    <div className="bg-[#FAF8F5]">
      {/* ── Featured image ── */}
      {post.featured_image ? (
        <div className="relative h-[55vh] min-h-[380px] max-h-[580px] w-full overflow-hidden rounded-b-[32px]">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Bottom-to-top gradient so title area stays legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/20 to-transparent" />

          {/* Category badge — sits in the image, top-left */}
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="absolute left-5 top-5 rounded-full bg-terracotta/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition-opacity hover:opacity-80 sm:left-8 sm:top-8"
            >
              {category.name}
            </Link>
          )}
        </div>
      ) : (
        /* No image: show category badge separately */
        <div className="pt-8">
          {category && (
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex rounded-full bg-terracotta/[0.09] px-3 py-1 text-xs font-semibold text-terracotta"
              >
                {category.name}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Article metadata ── */}
      <div className="mx-auto max-w-3xl px-4 pb-6 pt-8 sm:px-6">
        <h1 className="font-serif text-[2.4rem] font-semibold leading-[1.1] tracking-tight text-ink sm:text-[2.8rem]">
          {post.title}
        </h1>

        {/* Author / date / read time row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-sm font-medium text-ink/70">Arranged Co</span>

          {post.published_at && (
            <div className="flex items-center gap-1.5 text-sm text-ink/45">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </div>
          )}

          {post.reading_time && (
            <div className="flex items-center gap-1.5 text-sm text-ink/45">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{post.reading_time} min read</span>
            </div>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-3 text-[1.05rem] leading-relaxed text-ink/60">
            {post.excerpt}
          </p>
        )}

        {/* Affiliate disclosure */}
        <div className="mt-6 rounded-xl border border-terracotta/[0.12] bg-terracotta/[0.05] px-4 py-3">
          <p className="text-xs leading-relaxed text-ink/50">
            <span className="font-semibold text-ink/60">Disclosure:</span>{" "}
            Some links in this article are affiliate links. If you click and buy,
            we may earn a small commission — at no extra cost to you. We only
            recommend products we genuinely like.{" "}
            <Link
              href="/disclosure"
              className="underline underline-offset-2 hover:text-ink/70"
            >
              Read our full disclosure.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
