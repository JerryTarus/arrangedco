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
    <nav className="sticky top-24 text-sm space-y-1">
      <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Contents
      </p>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={cn(
            "block py-1 transition-colors hover:text-primary",
            h.level === 3 && "pl-3",
            activeId === h.id ? "text-primary font-medium" : "text-muted-foreground",
          )}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
