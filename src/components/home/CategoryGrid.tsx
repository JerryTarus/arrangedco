import Link from "next/link";
import { categories } from "@/config/categories";

export function CategoryGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="font-playfair text-3xl font-bold mb-8">Explore by room</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-2xl border hover:shadow-md hover:border-primary/30 transition-all"
          >
            <span className="text-2xl">{cat.emoji}</span>
            <span className="font-semibold text-sm group-hover:text-primary transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
