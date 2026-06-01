import { generateHTML } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";
import { AffiliateCard } from "@/components/editor/extensions/AffiliateCard";
import { CTAButtonNode } from "@/components/editor/extensions/CTAButton";
import { NewsletterBlock } from "@/components/editor/extensions/NewsletterBlock";
import { ResizableImage } from "@/components/editor/extensions/ResizableImage";
import { ComparisonTableNode } from "@/components/editor/extensions/ComparisonTable";

const sharedExtensions = [
  StarterKit,
  Image,
  ResizableImage,
  Link.configure({ openOnClick: false }),
  Highlight,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  AffiliateCard,
  CTAButtonNode,
  NewsletterBlock,
  ComparisonTableNode,
];

// Full editor extensions including UI-only ones
export const tiptapExtensions = [
  ...sharedExtensions,
  CharacterCount,
  Placeholder,
];

// Server-safe render extensions — excludes Placeholder and CharacterCount
// which may reference browser APIs in their initialisation paths.
export const renderExtensions = sharedExtensions;

// Inject id="" attributes onto heading elements so the TOC scroll-spy
// can target them. The id derivation must match extractHeadings() in
// TableOfContents.tsx exactly.
function addHeadingIds(html: string): string {
  return html.replace(
    /<(h[1-6])(\s[^>]*)?>(.+?)<\/h\1>/gi,
    (_, tag, attrs = "", inner) => {
      if (attrs.includes("id=")) return _;
      const text = inner.replace(/<[^>]+>/g, "");
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );
}

export function tiptapToHtml(content: JSONContent): string {
  const raw = generateHTML(content, renderExtensions);
  return addHeadingIds(raw);
}
