import { NewsletterEmbed } from "@/components/newsletter/NewsletterEmbed";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Newsletter",
  description:
    "Join the Arranged Co newsletter — weekly picks, organisation tips, and exclusive deals.",
});

export default function NewsletterPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold font-playfair mb-4">
        Join the community
      </h1>
      <p className="text-muted-foreground mb-10">
        Weekly picks, organisation guides, and reader-exclusive deals. No spam,
        ever.
      </p>
      <NewsletterEmbed />
    </section>
  );
}
