import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

type Props = { post: Post };

export function ArticleHero({ post }: Props) {
  return (
    <div className="relative">
      {post.featured_image && (
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-b-3xl">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        </div>
      )}
      <div
        className={`max-w-3xl mx-auto px-4 ${
          post.featured_image ? "-mt-20 relative z-10" : "pt-12"
        }`}
      >
        <h1 className="font-playfair text-4xl md:text-5xl font-bold leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {post.published_at && (
            <time>{formatDate(post.published_at)}</time>
          )}
          {post.reading_time && <span>{post.reading_time} min read</span>}
        </div>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        )}
      </div>
    </div>
  );
}
