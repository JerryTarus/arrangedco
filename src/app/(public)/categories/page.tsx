import Link from "next/link";
import { categories } from "@/config/categories";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Categories",
  description: "Explore home organisation by room and category.",
});

export default function CategoriesPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-playfair mb-10">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group rounded-2xl border p-6 hover:shadow-lg transition-shadow"
          >
            <span className="text-3xl mb-3 block">{cat.emoji}</span>
            <h2 className="font-semibold mb-1 group-hover:text-primary transition-colors">
              {cat.name}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {cat.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
