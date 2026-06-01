import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
};

type Props = { posts: Post[] };

export function PostsTable({ posts }: Props) {
  if (!posts.length) {
    return <p className="text-muted-foreground text-center py-12">No posts yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Published</TableHead>
          <TableHead className="w-24" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>
              <Badge variant={post.status === "published" ? "default" : "secondary"}>
                {post.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {post.published_at ? formatDate(post.published_at) : "—"}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" render={<Link href={`/admin/posts/${post.id}`} />}>
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
