"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, AlignLeft, AlignCenter, AlignRight,
  Highlighter, Link, Image, Undo, Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Props = { editor: Editor };

type ToolbarButton = {
  icon: React.ElementType;
  title: string;
  action: () => void;
  isActive?: () => boolean;
};

export function EditorToolbar({ editor }: Props) {
  const buttons: (ToolbarButton | "sep")[] = [
    { icon: Undo, title: "Undo", action: () => editor.chain().focus().undo().run() },
    { icon: Redo, title: "Redo", action: () => editor.chain().focus().redo().run() },
    "sep",
    { icon: Heading1, title: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive("heading", { level: 1 }) },
    { icon: Heading2, title: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive("heading", { level: 2 }) },
    { icon: Heading3, title: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive("heading", { level: 3 }) },
    "sep",
    { icon: Bold, title: "Bold", action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive("bold") },
    { icon: Italic, title: "Italic", action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive("italic") },
    { icon: Strikethrough, title: "Strike", action: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive("strike") },
    { icon: Highlighter, title: "Highlight", action: () => editor.chain().focus().toggleHighlight().run(), isActive: () => editor.isActive("highlight") },
    { icon: Code, title: "Code", action: () => editor.chain().focus().toggleCode().run(), isActive: () => editor.isActive("code") },
    "sep",
    { icon: AlignLeft, title: "Align left", action: () => editor.chain().focus().setTextAlign("left").run() },
    { icon: AlignCenter, title: "Align center", action: () => editor.chain().focus().setTextAlign("center").run() },
    { icon: AlignRight, title: "Align right", action: () => editor.chain().focus().setTextAlign("right").run() },
    "sep",
    { icon: List, title: "Bullet list", action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive("bulletList") },
    { icon: ListOrdered, title: "Ordered list", action: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive("orderedList") },
    { icon: Quote, title: "Blockquote", action: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive("blockquote") },
    { icon: Minus, title: "Divider", action: () => editor.chain().focus().setHorizontalRule().run() },
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b bg-muted/30 sticky top-0 z-10">
      {buttons.map((btn, i) =>
        btn === "sep" ? (
          <Separator key={i} orientation="vertical" className="h-5 mx-1" />
        ) : (
          <Button
            key={btn.title}
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", btn.isActive?.() && "bg-accent")}
            title={btn.title}
            onClick={btn.action}
            type="button"
          >
            <btn.icon className="h-3.5 w-3.5" />
          </Button>
        ),
      )}
    </div>
  );
}
