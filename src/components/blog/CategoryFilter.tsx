import Link from "next/link";
import { categories } from "@/config/categories";
import { cn } from "@/lib/utils";

type Props = { current?: string };

export function CategoryFilter({ current }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/blog"
        className={cn(
          "px-4 py-1.5 rounded-full text-sm border transition-colors",
          !current ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary",
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/categories/${cat.slug}`}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm border transition-colors",
            current === cat.slug
              ? "bg-primary text-primary-foreground border-primary"
              : "hover:border-primary",
          )}
        >
          {cat.emoji} {cat.name}
        </Link>
      ))}
    </div>
  );
}
