"use client";

import { useMemo } from "react";
import { useScrollspy } from "@/hooks/useScrollspy";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";

type Heading = { id: string; text: string; level: number };

function extractHeadings(content: Json | null): Heading[] {
  if (!content || typeof content !== "object" || Array.isArray(content)) return [];
  const doc = content as {
    content?: Array<{
      type?: string;
      attrs?: { level?: number };
      content?: Array<{ text?: string }>;
    }>;
  };
  if (!doc.content) return [];
  return doc.content
    .filter((n) => n.type === "heading" && (n.attrs?.level ?? 0) <= 3)
    .map((n) => {
      const text = n.content?.map((c) => c.text ?? "").join("") ?? "";
      // Must match the id derivation in tiptapToHtml → addHeadingIds
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      return { id, text, level: n.attrs?.level ?? 2 };
    });
}

type Props = { content: Json | null };

export function TableOfContents({ content }: Props) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const activeId = useScrollspy(headings.map((h) => h.id));

  if (!headings.length) return null;

  return (
    <nav className="sticky top-[96px] max-h-[calc(100vh-120px)] overflow-y-auto" aria-label="Table of contents">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-ink/35">
        Contents
      </p>
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block rounded-md py-1.5 text-sm transition-colors duration-150",
                h.level === 3 && "pl-3 text-[0.8rem]",
                h.level !== 3 && "pl-0",
                activeId === h.id
                  ? "font-medium text-terracotta"
                  : "text-ink/45 hover:text-ink/70",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
