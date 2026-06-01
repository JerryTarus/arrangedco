"use client";

import { forwardRef, useImperativeHandle, useState, useCallback, useRef } from "react";
import { ImageIcon, X, Star, Trash2 } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import type { Post } from "@/types";

type Category = { id: string; name: string };
type Tag      = { id: string; name: string; slug: string };

export type PostSettingsValues = {
  title:          string;
  slug:           string;
  excerpt:        string;
  status:         "draft" | "published" | "archived";
  isFeatured:     boolean;
  featuredImage:  string | null;
  categoryId:     string;
  tagIds:         string[];
  seoTitle:       string;
  seoDescription: string;
};

export type PostSettingsHandle = {
  getValues: () => PostSettingsValues;
};

type Props = {
  post?:      Post;
  categories: Category[];
  tags?:      Tag[];
  onDelete?:  () => void;
};

async function uploadFile(file: File): Promise<string | null> {
  const form = new FormData();
  form.append("file", file);
  try {
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) return null;
    const { url } = (await res.json()) as { url?: string };
    return url ?? null;
  } catch { return null; }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#3D3834]/40">
      {children}
    </p>
  );
}

function fieldCls(extra?: string) {
  return cn(
    "w-full rounded-lg border border-[#3D3834]/[0.12] bg-[#FAF8F5] px-3 py-2 text-sm text-[#3D3834]",
    "placeholder:text-[#3D3834]/30 outline-none transition-colors",
    "focus:border-[#C4533A]/50 focus:ring-2 focus:ring-[#C4533A]/10",
    extra,
  );
}

export const PostSettings = forwardRef<PostSettingsHandle, Props>(
  function PostSettings({ post, categories, tags = [], onDelete }, ref) {
    const [title,          setTitle]          = useState(post?.title             ?? "");
    const [slug,           setSlug]           = useState(post?.slug              ?? "");
    const [excerpt,        setExcerpt]        = useState(post?.excerpt           ?? "");
    const [status,         setStatus]         = useState<PostSettingsValues["status"]>(
      (post?.status as PostSettingsValues["status"]) ?? "draft");
    const [isFeatured,     setIsFeatured]     = useState(false);
    const [featuredImage,  setFeaturedImage]  = useState<string | null>(post?.featured_image ?? null);
    const [categoryId,     setCategoryId]     = useState(post?.category_id       ?? "");
    const [tagIds,         setTagIds]         = useState<string[]>([]);
    const [seoTitle,       setSeoTitle]       = useState(post?.seo_title         ?? "");
    const [seoDescription, setSeoDescription] = useState(post?.seo_description  ?? "");
    const [uploadingImg,   setUploadingImg]   = useState(false);
    const [dragging,       setDragging]       = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      getValues: () => ({
        title, slug, excerpt, status, isFeatured,
        featuredImage, categoryId, tagIds, seoTitle, seoDescription,
      }),
    }));

    const handleImgFile = useCallback(async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setUploadingImg(true);
      const url = await uploadFile(file);
      if (url) setFeaturedImage(url);
      setUploadingImg(false);
    }, []);

    return (
      <div className="flex h-full flex-col overflow-y-auto bg-[#FAF8F5]">
        <div className="border-b border-[#3D3834]/[0.07] px-4 py-3">
          <p className="text-xs font-semibold text-[#3D3834]/60">Post settings</p>
        </div>

        <div className="space-y-5 p-4">

          {/* ── Status dropdown ── */}
          <div>
            <SectionLabel>Status</SectionLabel>
            <select value={status}
              onChange={(e) => setStatus(e.target.value as PostSettingsValues["status"])}
              className={fieldCls()}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* ── Featured toggle ── */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#3D3834]">Featured post</p>
              <p className="text-[11px] text-[#3D3834]/40">Show in featured sections</p>
            </div>
            <button type="button" onClick={() => setIsFeatured((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                isFeatured
                  ? "bg-[#C4533A]/[0.10] text-[#C4533A]"
                  : "bg-[#3D3834]/[0.06] text-[#3D3834]/50",
              )}>
              <Star className={cn("h-3 w-3", isFeatured && "fill-[#C4533A]")} />
              {isFeatured ? "Featured" : "Normal"}
            </button>
          </div>

          {/* ── Title ── */}
          <div>
            <SectionLabel>Title</SectionLabel>
            <input type="text" value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!post) setSlug(slugify(e.target.value));
              }}
              placeholder="Post title" className={fieldCls()} />
          </div>

          {/* ── Slug ── */}
          <div>
            <SectionLabel>Slug</SectionLabel>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              placeholder="post-slug" className={cn(fieldCls(), "font-mono text-xs")} />
          </div>

          {/* ── Excerpt ── */}
          <div>
            <SectionLabel>Excerpt</SectionLabel>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary shown in listings…" rows={3}
              className={cn(fieldCls(), "resize-none")} />
          </div>

          {/* ── Featured image (drag-drop to Supabase Storage) ── */}
          <div>
            <SectionLabel>Featured image</SectionLabel>
            {featuredImage ? (
              <div className="relative overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredImage} alt="Featured"
                  className="aspect-[16/9] w-full rounded-xl object-cover" />
                <button type="button" onClick={() => setFeaturedImage(null)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#2A2420]/70 text-white hover:bg-[#2A2420]">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault(); setDragging(false);
                  const f = e.dataTransfer.files[0]; if (f) handleImgFile(f);
                }}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors",
                  dragging
                    ? "border-[#C4533A]/50 bg-[#C4533A]/[0.04]"
                    : "border-[#3D3834]/[0.12] hover:border-[#C4533A]/30 hover:bg-[#C4533A]/[0.02]",
                )}>
                {uploadingImg ? (
                  <p className="text-xs text-[#3D3834]/50">Uploading…</p>
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-[#3D3834]/25" />
                    <p className="text-center text-xs text-[#3D3834]/45">
                      Drag & drop or click to upload
                    </p>
                  </>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]; e.target.value = ""; if (f) handleImgFile(f);
              }} />
          </div>

          {/* ── Category selector ── */}
          <div>
            <SectionLabel>Category</SectionLabel>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className={fieldCls()}>
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* ── Tag multi-select ── */}
          {tags.length > 0 && (
            <div>
              <SectionLabel>Tags</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const active = tagIds.includes(tag.id);
                  return (
                    <button key={tag.id} type="button"
                      onClick={() => setTagIds((p) =>
                        active ? p.filter((id) => id !== tag.id) : [...p, tag.id]
                      )}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                        active
                          ? "bg-[#C4533A]/[0.10] text-[#C4533A]"
                          : "bg-[#3D3834]/[0.06] text-[#3D3834]/55 hover:bg-[#3D3834]/[0.10]",
                      )}>
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SEO meta fields with character counts ── */}
          <div className="space-y-3 rounded-xl border border-[#3D3834]/[0.08] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#3D3834]/40">SEO</p>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <SectionLabel>Meta title</SectionLabel>
                <span className={cn("text-[10px] tabular-nums",
                  seoTitle.length > 60 ? "text-red-500" : "text-[#3D3834]/30")}>
                  {seoTitle.length}/60
                </span>
              </div>
              <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || "Meta title…"} maxLength={80} className={fieldCls()} />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <SectionLabel>Meta description</SectionLabel>
                <span className={cn("text-[10px] tabular-nums",
                  seoDescription.length > 160 ? "text-red-500" : "text-[#3D3834]/30")}>
                  {seoDescription.length}/160
                </span>
              </div>
              <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={excerpt || "Meta description…"} maxLength={200} rows={3}
                className={cn(fieldCls(), "resize-none")} />
            </div>
          </div>

          {/* ── Move to trash ── */}
          {post && onDelete && (
            <button type="button" onClick={onDelete}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" />
              Move to trash
            </button>
          )}
        </div>
      </div>
    );
  },
);
