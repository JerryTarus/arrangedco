import Link from "next/link";

export function AffiliateDisclosure() {
  return (
    <p className="text-xs text-muted-foreground">
      *As an Amazon Associate I earn from qualifying purchases.{" "}
      <Link href="/disclosure" className="underline underline-offset-2 hover:text-foreground">
        Full disclosure
      </Link>
    </p>
  );
}
