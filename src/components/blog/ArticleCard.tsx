import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/types";

type Props = { post: Partial<Post> & Pick<Post, "title" | "slug"> };

export function ArticleCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        <Image
          src={post.featured_image ?? "/placeholders/article-placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col flex-1 p-5 gap-2">
        {post.reading_time && (
          <Badge variant="secondary" className="self-start text-xs">
            {post.reading_time} min read
          </Badge>
        )}
        <h3 className="font-playfair font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}
        {post.published_at && (
          <time className="text-xs text-muted-foreground mt-auto pt-2">
            {formatDate(post.published_at)}
          </time>
        )}
      </div>
    </Link>
  );
}
