import Link from "next/link";

const homeCategories = [
  {
    slug: "kitchen",
    name: "Kitchen",
    description: "Tools for the heart of your home",
    gradient: "from-amber-50 via-orange-100 to-amber-200",
    dot: "#C4533A",
  },
  {
    slug: "home-office",
    name: "Workspace",
    description: "Desk setups for peak productivity",
    gradient: "from-slate-100 via-indigo-50 to-slate-200",
    dot: "#5B6591",
  },
  {
    slug: "closet",
    name: "Storage",
    description: "Smart solutions for every space",
    gradient: "from-stone-100 via-stone-50 to-amber-50",
    dot: "#8B7355",
  },
  {
    slug: "living-room",
    name: "Decor",
    description: "Elevate every corner",
    gradient: "from-rose-50 via-pink-50 to-orange-50",
    dot: "#A0522D",
  },
] as const;

export function CategoryGrid() {
  return (
    <section className="bg-[#FAF8F5] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Shop by space
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-terracotta transition-opacity hover:opacity-70"
          >
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {homeCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-transform duration-500 group-hover:scale-[1.04]`}
              />

              {/* Decorative layered circles */}
              <div
                className="absolute left-1/2 top-[38%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 transition-opacity duration-300 group-hover:opacity-35"
                style={{ backgroundColor: cat.dot }}
              />
              <div
                className="absolute left-1/2 top-[38%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                style={{ backgroundColor: cat.dot }}
              />

              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />

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
    </section>
  );
}
