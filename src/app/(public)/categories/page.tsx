import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { categories as configCategories } from "@/config/categories";
import { getGradient } from "@/config/gradients";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "All Collections",
  description:
    "Browse every room and space — curated guides and honest product picks for kitchen, bedroom, workspace, and more.",
});

type MergedCategory = {
  id: string | undefined;
  slug: string;
  name: string;
  description: string;
  emoji: string;
  gradient: string;
  image: string | null;
  count: number;
};

export default async function CategoriesPage() {
  // Start with config data as the source of truth for visual tokens
  let merged: MergedCategory[] = configCategories.map((c) => ({
    id: undefined,
    slug: c.slug,
    name: c.name,
    description: c.description,
    emoji: c.emoji,
    gradient: getGradient(c.slug),
    image: null,
    count: 0,
  }));

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = await createClient();

      // One query for categories, one for post counts — both run in parallel
      const [dbCatsResult, postCountsResult] = await Promise.all([
        supabase.from("categories").select("id, name, slug, image"),
        supabase
          .from("posts")
          .select("category_id")
          .eq("status", "published")
          .not("category_id", "is", null),
      ]);

      // Build a category_id → count map from the posts result
      const countMap: Record<string, number> = {};
      for (const p of postCountsResult.data ?? []) {
        if (p.category_id)
          countMap[p.category_id] = (countMap[p.category_id] ?? 0) + 1;
      }

      // Merge DB data into config array (config order is canonical)
      merged = configCategories.map((c) => {
        const dbCat = dbCatsResult.data?.find((d) => d.slug === c.slug);
        return {
          id: dbCat?.id,
          slug: c.slug,
          name: c.name,
          description: c.description,
          emoji: c.emoji,
          gradient: getGradient(c.slug),
          image: dbCat?.image ?? null,
          count: dbCat ? (countMap[dbCat.id] ?? 0) : 0,
        };
      });
    } catch {
      // Supabase unavailable — use config data with zero counts
    }
  }

  return (
    <div className="bg-[#FAF8F5]">
      {/* ── Page header ── */}
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-terracotta">
          Explore
        </p>
        <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">
          All Collections
        </h1>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-ink/55">
          Every room, every budget. Browse curated guides and honest product
          recommendations organised by space.
        </p>
      </div>

      {/* ── Category grid ── */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {merged.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Background — image if available, otherwise gradient */}
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-[1.04]",
                    cat.gradient,
                  )}
                />
              )}

              {/* Bottom fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />

              {/* Article count badge */}
              {cat.count > 0 && (
                <div className="absolute right-3 top-3">
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-ink/70 backdrop-blur-sm">
                    {cat.count}
                  </span>
                </div>
              )}

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <p className="font-serif text-lg font-semibold leading-tight text-white sm:text-xl">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-[11px] text-white/65 sm:text-sm">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
