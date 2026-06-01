import { generateHTML } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";

const extensions = [
  StarterKit,
  Image,
  Link.configure({ openOnClick: false }),
  Highlight,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  CharacterCount,
  Placeholder,
];

export function tiptapToHtml(content: JSONContent): string {
  return generateHTML(content, extensions);
}

export { extensions as tiptapExtensions };
