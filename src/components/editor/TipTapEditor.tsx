"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { EditorToolbar } from "./EditorToolbar";
import "@/styles/editor.css";
import type { Post } from "@/types";

type Props = { post?: Post };

export function TipTapEditor({ post }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing your article…" }),
      CharacterCount,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: (post?.content as import("@tiptap/react").Content) ?? "",
    editorProps: {
      attributes: { class: "tiptap-editor" },
    },
  });

  if (!editor) return null;

  const wordCount = editor.storage.characterCount?.words?.() ?? 0;

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <div className="border-t px-4 py-2 text-xs text-muted-foreground flex justify-end">
        {wordCount} words
      </div>
    </div>
  );
}
