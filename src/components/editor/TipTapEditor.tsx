"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
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
import type { JSONContent, Editor } from "@tiptap/react";

import { AffiliateCard } from "./extensions/AffiliateCard";
import { CTAButtonNode } from "./extensions/CTAButton";
import { NewsletterBlock } from "./extensions/NewsletterBlock";
import { ResizableImage } from "./extensions/ResizableImage";
import { ComparisonTableNode } from "./extensions/ComparisonTable";
import { AffiliateCardView } from "./extensions/AffiliateCardView";
import { ResizableImageView } from "./extensions/ResizableImageView";
import { EditorToolbar } from "./EditorToolbar";
import { SlashMenu, SLASH_COMMANDS } from "./SlashMenu";
import type { SlashCommand } from "./SlashMenu";

import "@/styles/editor.css";
import type { Post } from "@/types";

// ── Node view extensions (client-only) ───────────────────────────────────────

const AffiliateCardEditor = AffiliateCard.extend({
  addNodeView() {
    return ReactNodeViewRenderer(AffiliateCardView);
  },
});

const ResizableImageEditor = ResizableImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
}).configure({});

// ── Image upload helper ───────────────────────────────────────────────────────

async function uploadImageFile(file: File): Promise<string | null> {
  const form = new FormData();
  form.append("file", file);
  try {
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) return null;
    const { url } = (await res.json()) as { url?: string };
    return url ?? null;
  } catch {
    return null;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type TipTapEditorHandle = {
  getJSON: () => JSONContent | null;
  getWordCount: () => number;
};

type SlashMenuState = {
  query: string;
  position: { top: number; left: number };
  rangeStart: number;
};

type Props = { post?: Post };

// ── Component ─────────────────────────────────────────────────────────────────

export const TipTapEditor = forwardRef<TipTapEditorHandle, Props>(
  function TipTapEditor({ post }, ref) {
    const [slashMenu, setSlashMenu] = useState<SlashMenuState | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const pendingInsertRef = useRef<((url: string) => void) | null>(null);

    // ── Detect slash command trigger on content update ──────────────────────
    function handleUpdate({ editor }: { editor: Editor }) {
      const { from, empty } = editor.state.selection;
      if (!empty) { setSlashMenu(null); return; }

      const $pos = editor.state.doc.resolve(from);
      const paraStart = $pos.start();
      const textBefore = editor.state.doc.textBetween(paraStart, from, "\n");

      if (textBefore.startsWith("/")) {
        const coords = editor.view.coordsAtPos(paraStart + 1);
        setSlashMenu({
          query: textBefore.slice(1).toLowerCase(),
          position: { top: coords.bottom, left: coords.left },
          rangeStart: paraStart,
        });
      } else {
        setSlashMenu(null);
      }
    }

    // ── Execute a slash command ───────────────────────────────────────────────
    const execSlashCommand = useCallback(
      (cmd: SlashCommand, editor: Editor) => {
        if (!slashMenu) return;
        const { from } = editor.state.selection;

        // Delete the "/query" text first
        editor.chain().focus().deleteRange({ from: slashMenu.rangeStart, to: from }).run();

        switch (cmd.id) {
          case "product-card":
            editor.chain().focus().insertContent({
              type: "affiliateCard",
              attrs: { productName: "Product name", affiliateSlug: "" },
            }).run();
            break;
          case "comparison-table":
            editor.chain().focus().insertContent({
              type: "comparisonTable",
              attrs: { rows: [], columns: [] },
            }).run();
            break;
          case "cta-button":
            editor.chain().focus().insertContent({
              type: "ctaButton",
              attrs: { label: "View on Amazon", href: "", variant: "primary" },
            }).run();
            break;
          case "newsletter":
            editor.chain().focus().insertContent({
              type: "newsletterBlock",
              attrs: { headline: "Enjoyed this article?", subtext: "Subscribe for weekly picks." },
            }).run();
            break;
          case "image":
            // Trigger hidden file input
            if (imageInputRef.current) {
              pendingInsertRef.current = (url: string) => {
                editor.chain().focus().insertContent({
                  type: "resizableImage",
                  attrs: { src: url, alt: "" },
                }).run();
              };
              imageInputRef.current.click();
            }
            break;
          case "heading-2":
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            break;
          case "heading-3":
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            break;
          case "quote":
            editor.chain().focus().toggleBlockquote().run();
            break;
        }
        setSlashMenu(null);
      },
      [slashMenu],
    );

    // ── Editor instance ───────────────────────────────────────────────────────
    const editor = useEditor({
      extensions: [
        StarterKit.configure({ horizontalRule: {} }),
        Image,
        ResizableImageEditor,
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: 'Start writing… or type "/" for commands' }),
        CharacterCount,
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Table.configure({ resizable: true }),
        TableRow,
        TableCell,
        TableHeader,
        AffiliateCardEditor,
        CTAButtonNode,
        NewsletterBlock,
        ComparisonTableNode,
      ],
      content: (post?.content as JSONContent) ?? "",
      editorProps: {
        attributes: { class: "tiptap-editor" },

        // ── Image paste ──────────────────────────────────────────────────────
        handlePaste(_, event) {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (const item of Array.from(items)) {
            if (item.type.startsWith("image/")) {
              const file = item.getAsFile();
              if (!file || !editor) return false;
              uploadImageFile(file).then((url) => {
                if (url) {
                  editor.chain().focus().insertContent({
                    type: "resizableImage",
                    attrs: { src: url, alt: "" },
                  }).run();
                }
              });
              return true;
            }
          }
          return false;
        },

        // ── Image drop ───────────────────────────────────────────────────────
        handleDrop(_, event) {
          const files = event.dataTransfer?.files;
          if (!files?.length || !editor) return false;
          for (const file of Array.from(files)) {
            if (file.type.startsWith("image/")) {
              uploadImageFile(file).then((url) => {
                if (url) {
                  editor.chain().focus().insertContent({
                    type: "resizableImage",
                    attrs: { src: url, alt: "" },
                  }).run();
                }
              });
              return true;
            }
          }
          return false;
        },
      },
      onUpdate: handleUpdate,
    });

    // ── Expose handle ─────────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      getJSON: () => editor?.getJSON() ?? null,
      getWordCount: () => editor?.storage.characterCount?.words?.() ?? 0,
    }));

    // ── Close slash menu on outside click ─────────────────────────────────────
    useEffect(() => {
      function onPointerDown() { setSlashMenu(null); }
      if (slashMenu) document.addEventListener("pointerdown", onPointerDown);
      return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [slashMenu]);

    // ── Hidden file input for image-via-slash ─────────────────────────────────
    async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      const url = await uploadImageFile(file);
      if (url && pendingInsertRef.current) {
        pendingInsertRef.current(url);
        pendingInsertRef.current = null;
      }
    }

    const wordCount = editor?.storage.characterCount?.words?.() ?? 0;

    return (
      <div className="relative flex h-full flex-col">
        {editor && <EditorToolbar editor={editor} />}

        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>

        <div className="flex items-center justify-between border-t border-[#3D3834]/[0.07] px-4 py-2">
          <span className="text-xs text-[#3D3834]/35">
            Type <kbd className="rounded bg-[#3D3834]/[0.08] px-1 py-0.5 font-mono text-[10px]">/</kbd> for commands
          </span>
          <span className="text-xs text-[#3D3834]/35 tabular-nums">{wordCount} words</span>
        </div>

        {/* Slash command palette */}
        {slashMenu && editor && (
          <SlashMenu
            query={slashMenu.query}
            position={slashMenu.position}
            onSelect={(cmd) => execSlashCommand(cmd, editor)}
            onClose={() => setSlashMenu(null)}
          />
        )}

        {/* Hidden file input for slash → image */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileInput}
        />
      </div>
    );
  },
);
