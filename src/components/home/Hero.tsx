import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const mockProduct = {
  category: "Kitchen",
  name: "Brass Bamboo Organiser Set",
  price: "£34.99",
  rating: 4.8,
  reviews: 342,
};

const trustStats = [
  { value: "12k+", label: "monthly readers" },
  { value: "500+", label: "products reviewed" },
  { value: "100%", label: "independent" },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5]">
      {/* Warm background blobs */}
      <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full bg-terracotta/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-coral/[0.05] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2 lg:gap-20">

          {/* ── Left: copy ── */}
          <div className="flex flex-col">
            <span className="mb-5 inline-flex w-fit items-center rounded-full border border-terracotta/25 bg-terracotta/[0.07] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-terracotta">
              Curated home &amp; lifestyle
            </span>

            <h1 className="font-serif text-[2.8rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Find exactly what
              <br className="hidden sm:block" /> your space needs
            </h1>

            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-ink/60">
              Honest, curated recommendations for the products that make your
              home more beautiful and easier to live in — every single day.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-cta-gradient px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75"
              >
                Shop top picks <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-xl border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/35 hover:bg-ink/[0.03]"
              >
                Browse guides
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-ink/[0.08] pt-7">
              {trustStats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="text-base font-semibold text-ink">{s.value}</span>
                  <span className="text-sm text-ink/45">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: floating product cards ── */}
          <div className="relative flex items-center justify-center py-10 md:justify-end md:py-0">
            {/* Soft ambient circle */}
            <div className="pointer-events-none absolute h-[320px] w-[320px] rounded-full bg-terracotta/[0.09]" />

            {/* Secondary card — peeking behind */}
            <div className="absolute -left-2 bottom-8 z-10 w-44 -rotate-[4deg] overflow-hidden rounded-2xl bg-white opacity-80 shadow-lg md:-left-6">
              <div className="h-20 w-full bg-gradient-to-br from-slate-100 to-indigo-100" />
              <div className="p-3">
                <p className="truncate text-[11px] font-medium text-ink/55">
                  Minimalist Desk Caddy
                </p>
                <p className="text-xs font-semibold text-ink">£22.99</p>
              </div>
            </div>

            {/* Primary featured card */}
            <div className="relative z-20 w-[268px] rotate-[2.5deg] overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Image placeholder area */}
              <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-[#F5EEE8] to-[#E8D9CC]">
                {/* Concentric circles to suggest product photography */}
                <div className="absolute left-1/2 top-1/2 h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35" />
                <div className="absolute left-1/2 top-1/2 h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />
                <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta/25" />

                {/* Editor's Pick badge */}
                <span className="absolute left-3 top-3 rounded-full bg-terracotta px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                  Editor&apos;s Pick
                </span>
              </div>

              {/* Card body */}
              <div className="p-4">
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-terracotta">
                  {mockProduct.category}
                </p>
                <h3 className="font-serif text-[0.93rem] font-semibold leading-snug text-ink">
                  {mockProduct.name}
                </h3>

                {/* Star rating */}
                <div className="mt-1.5 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(mockProduct.rating)
                          ? "fill-terracotta text-terracotta"
                          : "fill-ink/10 text-ink/10"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[11px] text-ink/40">
                    ({mockProduct.reviews})
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">{mockProduct.price}</span>
                  <Link
                    href="/shop"
                    className="rounded-lg bg-cta-gradient px-3 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
