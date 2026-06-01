import type { JSONContent } from "@tiptap/react";
import type { Json } from "@/types/database";
import { tiptapToHtml } from "@/lib/tiptap";
import { AffiliateProductCard } from "@/components/affiliate/AffiliateProductCard";

type Props = { content: Json | null };

const CUSTOM_NODE_TYPES = new Set(["affiliateCard", "ctaButton", "newsletterBlock"]);

type ProseGroup = { kind: "prose"; doc: JSONContent };
type AffiliatGroup = {
  kind: "affiliateCard";
  attrs: {
    productName: string;
    productImage: string | null;
    price: string | null;
    merchant: string | null;
    affiliateSlug: string;
  };
};
type CtaGroup = {
  kind: "ctaButton";
  attrs: { label: string; href: string };
};
type Group = ProseGroup | AffiliatGroup | CtaGroup;

function segmentContent(doc: JSONContent): Group[] {
  const topLevel = doc.content ?? [];
  const groups: Group[] = [];
  let proseBuffer: JSONContent[] = [];

  function flushProse() {
    if (proseBuffer.length === 0) return;
    groups.push({ kind: "prose", doc: { type: "doc", content: proseBuffer } });
    proseBuffer = [];
  }

  for (const node of topLevel) {
    const type = node.type ?? "";
    if (!CUSTOM_NODE_TYPES.has(type)) {
      proseBuffer.push(node);
      continue;
    }
    flushProse();
    const attrs = (node.attrs ?? {}) as Record<string, unknown>;
    if (type === "affiliateCard") {
      groups.push({
        kind: "affiliateCard",
        attrs: {
          productName: String(attrs.productName ?? ""),
          productImage: attrs.productImage ? String(attrs.productImage) : null,
          price: attrs.price ? String(attrs.price) : null,
          merchant: attrs.merchant ? String(attrs.merchant) : null,
          affiliateSlug: String(attrs.affiliateSlug ?? ""),
        },
      });
    } else if (type === "ctaButton") {
      groups.push({
        kind: "ctaButton",
        attrs: {
          label: String(attrs.label ?? "View product"),
          href: String(attrs.href ?? ""),
        },
      });
    }
    // newsletterBlock is editor-only; skip in render
  }
  flushProse();
  return groups;
}

export function ArticleBody({ content }: Props) {
  if (
    !content ||
    typeof content === "string" ||
    typeof content === "number" ||
    typeof content === "boolean" ||
    Array.isArray(content)
  ) {
    return null;
  }

  const doc = content as JSONContent;
  if (!doc.type || !doc.content) return null;

  const groups = segmentContent(doc);

  return (
    <div>
      {groups.map((group, i) => {
        if (group.kind === "prose") {
          const html = tiptapToHtml(group.doc);
          return (
            <div
              key={i}
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        if (group.kind === "affiliateCard") {
          return <AffiliateProductCard key={i} {...group.attrs} />;
        }

        if (group.kind === "ctaButton") {
          return (
            <div key={i} className="my-6">
              <a
                href={group.attrs.href}
                target="_blank"
                rel="nofollow noopener sponsored"
                className="inline-flex items-center gap-2 rounded-xl bg-cta-gradient px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75"
              >
                {group.attrs.label} →
              </a>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
