import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
};

function buildPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-1.5 py-10"
      aria-label="Pagination"
    >
      <Link
        href={`${basePath}?page=${page - 1}`}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors",
          page <= 1
            ? "pointer-events-none border-ink/[0.06] text-ink/20"
            : "border-ink/[0.10] text-ink/60 hover:border-terracotta/40 hover:text-terracotta",
        )}
        aria-label="Previous page"
      >
        ←
      </Link>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-ink/25"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={`${basePath}?page=${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors",
              p === page
                ? "bg-terracotta text-white shadow-sm"
                : "border border-ink/[0.10] text-ink/60 hover:border-terracotta/40 hover:text-terracotta",
            )}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={`${basePath}?page=${page + 1}`}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors",
          page >= totalPages
            ? "pointer-events-none border-ink/[0.06] text-ink/20"
            : "border-ink/[0.10] text-ink/60 hover:border-terracotta/40 hover:text-terracotta",
        )}
        aria-label="Next page"
      >
        →
      </Link>
    </nav>
  );
}
