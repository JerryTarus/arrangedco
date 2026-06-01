import Image from "next/image";
import type { Author } from "@/types";

type Props = { author: Author };

export function AuthorCard({ author }: Props) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border">
      <Image
        src={author.avatar_url ?? "/placeholders/avatar-placeholder.jpg"}
        alt={author.name ?? "Author"}
        width={56}
        height={56}
        className="rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{author.name}</p>
        {author.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{author.bio}</p>
        )}
      </div>
    </div>
  );
}
