"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TipTapEditor } from "./TipTapEditor";
import { PostSettings } from "./PostSettings";
import type { TipTapEditorHandle } from "./TipTapEditor";
import type { PostSettingsHandle } from "./PostSettings";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };
type Tag      = { id: string; name: string; slug: string };

type Props = {
  categories: Category[];
  tags:       Tag[];
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function NewPostClient({ categories, tags }: Props) {
  const router = useRouter();
  const editorRef   = useRef<TipTapEditorHandle>(null);
  const settingsRef = useRef<PostSettingsHandle>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  async function save(publish = false) {
    const content  = editorRef.current?.getJSON()   ?? null;
    const settings = settingsRef.current?.getValues();
    if (!settings) return;

    setSaveState("saving");
    const supabase = createClient();

    const status   = publish ? "published" : settings.status === "archived" ? "archived" : "draft";
    const payload  = {
      title:           settings.title || "Untitled",
      slug:            settings.slug  || `post-${Date.now()}`,
      excerpt:         settings.excerpt         || null,
      content:         content,
      status:          status as "draft" | "published" | "archived",
      is_featured:     settings.isFeatured,
      featured_image:  settings.featuredImage,
      category_id:     settings.categoryId      || null,
      seo_title:       settings.seoTitle        || null,
      seo_description: settings.seoDescription  || null,
      published_at:    publish ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from("posts").insert(payload);

    if (error) {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
      return;
    }

    setSaveState("saved");
    setTimeout(() => {
      router.push("/admin/posts");
    }, 800);
  }

  async function handlePublish() {
    setShowPublishConfirm(false);
    await save(true);
  }

  const statusLabel =
    saveState === "saving" ? "Saving…"
    : saveState === "saved"  ? "Saved!"
    : saveState === "error"  ? "Error saving"
    : "Draft";

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-[#FAF8F5]">

      {/* ── Top bar ── */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#3D3834]/[0.07] bg-[#FAF8F5]/95 px-4 backdrop-blur-[6px]">
        {/* Left: back + status */}
        <div className="flex items-center gap-3">
          <Link href="/admin/posts"
            className="flex items-center gap-1.5 text-[#3D3834]/50 transition-colors hover:text-[#3D3834]">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs">Posts</span>
          </Link>
          <span className="text-[#3D3834]/20">·</span>
          <div className="flex items-center gap-1.5 text-xs">
            {saveState === "saving" && <Loader2 className="h-3 w-3 animate-spin text-[#3D3834]/40" />}
            {saveState === "saved"  && <CheckCircle className="h-3 w-3 text-emerald-500" />}
            <span className={cn(
              "text-[#3D3834]/45",
              saveState === "saved" && "text-emerald-600",
              saveState === "error" && "text-red-500",
            )}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Right: Save Draft + Publish */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saveState === "saving"}
            className="rounded-lg border border-[#3D3834]/[0.12] px-3.5 py-1.5 text-xs font-medium text-[#3D3834]/70 transition-colors hover:bg-[#3D3834]/[0.04] disabled:opacity-50"
          >
            Save draft
          </button>

          <button
            type="button"
            onClick={() => setShowPublishConfirm(true)}
            disabled={saveState === "saving"}
            className="rounded-lg bg-cta-gradient px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      {/* ── Publish confirmation overlay ── */}
      {showPublishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2420]/40 backdrop-blur-sm"
          onClick={() => setShowPublishConfirm(false)}>
          <div className="w-80 rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-lg font-semibold text-[#3D3834]">Publish this post?</h3>
            <p className="mt-1.5 text-sm text-[#3D3834]/55">
              The post will be live and visible to all visitors immediately.
            </p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setShowPublishConfirm(false)}
                className="flex-1 rounded-xl border border-[#3D3834]/[0.12] py-2 text-sm text-[#3D3834]/60 transition-colors hover:bg-[#3D3834]/[0.04]">
                Cancel
              </button>
              <button type="button" onClick={handlePublish}
                className="flex-1 rounded-xl bg-cta-gradient py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Publish now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Editor + Sidebar ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <TipTapEditor ref={editorRef} />
        </div>

        {/* Settings sidebar */}
        <aside className="w-72 shrink-0 overflow-hidden border-l border-[#3D3834]/[0.07]">
          <PostSettings
            ref={settingsRef}
            categories={categories}
            tags={tags}
          />
        </aside>
      </div>
    </div>
  );
}
