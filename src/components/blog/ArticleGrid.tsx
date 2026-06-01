import { ArticleCard } from "./ArticleCard";
import type { Post } from "@/types";

type Props = { posts: (Partial<Post> & Pick<Post, "title" | "slug" | "id">)[] };

export function ArticleGrid({ posts }: Props) {
  if (!posts.length) {
    return (
      <p className="text-center text-muted-foreground py-20">No articles found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  );
}
