import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { PostSettings } from "@/components/editor/PostSettings";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name"),
  ]);

  if (!post) notFound();

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <TipTapEditor post={post} />
      </div>
      <aside className="w-72 border-l bg-muted/30 overflow-y-auto shrink-0">
        <PostSettings post={post} categories={categories ?? []} />
      </aside>
    </div>
  );
}
