import { formatDate } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { AffiliateLink } from "@/types";

type Props = { links: AffiliateLink[] };

export function LinksTable({ links }: Props) {
  if (!links.length) {
    return <p className="text-muted-foreground text-center py-12">No links yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell className="font-medium">{link.product_name}</TableCell>
            <TableCell className="font-mono text-sm text-muted-foreground">
              /go/{link.slug}
            </TableCell>
            <TableCell>{link.click_count}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {formatDate(link.created_at)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
