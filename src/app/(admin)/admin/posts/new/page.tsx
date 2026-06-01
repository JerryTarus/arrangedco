import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { PostSettings } from "@/components/editor/PostSettings";
import { createClient } from "@/lib/supabase/server";

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name");

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <TipTapEditor />
      </div>
      <aside className="w-72 border-l bg-muted/30 overflow-y-auto shrink-0">
        <PostSettings categories={categories ?? []} />
      </aside>
    </div>
  );
}
