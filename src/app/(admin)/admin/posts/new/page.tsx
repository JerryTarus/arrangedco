import { createClient } from "@/lib/supabase/server";
import { NewPostClient } from "@/components/editor/NewPostClient";

export default async function NewPostPage() {
  const categories: { id: string; name: string }[]            = [];
  const tags:       { id: string; name: string; slug: string }[] = [];

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = await createClient();
      const [catsResult, tagsResult] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("tags").select("id, name, slug").order("name"),
      ]);
      categories.push(...(catsResult.data ?? []));
      tags.push(...(tagsResult.data ?? []));
    } catch {
      // Non-fatal — editor still usable without categories/tags
    }
  }

  return <NewPostClient categories={categories} tags={tags} />;
}
