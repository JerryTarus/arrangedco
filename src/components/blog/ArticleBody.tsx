import { tiptapToHtml } from "@/lib/tiptap";
import type { JSONContent } from "@tiptap/react";
import type { Json } from "@/types/database";

type Props = { content: Json | null };

export function ArticleBody({ content }: Props) {
  if (!content || typeof content === "string" || typeof content === "number" || typeof content === "boolean") return null;
  const html = tiptapToHtml(content as JSONContent);

  return (
    <article
      className="prose prose-neutral max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
