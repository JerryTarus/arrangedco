"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Post } from "@/types";

type Category = { id: string; name: string };
type Props = { post?: Post; categories: Category[] };

export function PostSettings({ post, categories }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [categoryId, setCategoryId] = useState(post?.category_id ?? "");
  const [published, setPublished] = useState(post?.status === "published");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const status = published ? ("published" as const) : ("draft" as const);
    const data = {
      title,
      slug: slug || slugify(title),
      excerpt: excerpt || null,
      category_id: categoryId || null,
      status,
      published_at: published ? new Date().toISOString() : null,
    };

    if (post?.id) {
      await supabase.from("posts").update(data).eq("id", post.id);
    } else {
      await supabase.from("posts").insert(data);
    }
    setSaving(false);
    router.push("/admin/posts");
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-semibold text-sm">Post settings</h2>

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!post) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="published">Published</Label>
        <Switch
          id="published"
          checked={published}
          onCheckedChange={setPublished}
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? "Saving…" : post ? "Save changes" : "Create post"}
      </Button>
    </div>
  );
}
