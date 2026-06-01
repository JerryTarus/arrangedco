import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PostsTable } from "@/components/admin/PostsTable";
import { Button } from "@/components/ui/button";

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button render={<Link href="/admin/posts/new" />}>New Post</Button>
      </div>
      <PostsTable posts={posts ?? []} />
    </div>
  );
}
