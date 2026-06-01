import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Learn about Arranged Co — our mission to help you find the best organisation products for every room.",
});

export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold font-playfair mb-6">About Arranged Co</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">
        Arranged Co is a curated guide to home organisation and intentional living. We
        research, test, and recommend products that genuinely make your space work better.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Every recommendation is independently chosen. When you buy through our links, we
        may earn a commission — at no extra cost to you. See our{" "}
        <a href="/disclosure" className="text-primary underline underline-offset-2">
          affiliate disclosure
        </a>{" "}
        for full details.
      </p>
    </section>
  );
}
