import Link from "next/link";
import { Clock } from "lucide-react";

const mockArticles = [
  {
    id: "1",
    slug: "kitchen-organisers-that-changed-how-we-cook",
    category: "Kitchen",
    categoryClass: "bg-terracotta/[0.09] text-terracotta",
    title: "10 Kitchen Organisers That Changed How We Cook",
    excerpt:
      "From drawer dividers to countertop caddies — the small changes that make a kitchen genuinely work for you.",
    readTime: 6,
    gradient: "from-amber-50 via-orange-50 to-amber-100",
  },
  {
    id: "2",
    slug: "workspace-setup-that-made-me-productive",
    category: "Workspace",
    categoryClass: "bg-indigo-50 text-indigo-600",
    title: "The Workspace Setup That Finally Made Me Productive",
    excerpt:
      "Cable management, the right desk lamp, and one very specific drawer organiser. Here's the full tour.",
    readTime: 4,
    gradient: "from-slate-100 via-indigo-50 to-slate-100",
  },
  {
    id: "3",
    slug: "storage-solutions-for-every-room",
    category: "Storage",
    categoryClass: "bg-stone-100 text-stone-600",
    title: "A Storage Solution for Every Room (And Every Budget)",
    excerpt:
      "A full-home edit of the best storage buys — from under-£10 jars to the IKEA shelf that's always sold out.",
    readTime: 8,
    gradient: "from-stone-100 via-amber-50 to-stone-50",
  },
] as const;

export function FeaturedArticles() {
  return (
    <section className="bg-[#FAF8F5] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Latest guides
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-terracotta transition-opacity hover:opacity-70"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow duration-300 hover:shadow-lg"
            >
              {/* Image placeholder — rich gradient */}
              <div
                className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${article.gradient}`}
              >
                {/* Decorative shapes to add depth */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/30" />
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/20" />
                <div className="absolute right-6 bottom-6 h-10 w-10 rounded-full bg-white/40" />

                {/* Category badge */}
                <div className="absolute left-3 top-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${article.categoryClass}`}
                  >
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-1.5 text-ink/40">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs">{article.readTime} min read</span>
                </div>

                <h3 className="font-serif text-[1.13rem] font-semibold leading-snug text-ink transition-colors duration-150 group-hover:text-terracotta">
                  {article.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/55 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="mt-4 border-t border-ink/[0.07] pt-4">
                  <span className="text-xs font-medium text-terracotta">
                    Read article →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
