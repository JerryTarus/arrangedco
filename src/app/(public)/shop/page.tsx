import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Shop",
  description:
    "This week's top home organisation picks — hand-picked and editor-approved.",
});

export default function ShopPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-playfair mb-4">Top Picks</h1>
      <p className="text-muted-foreground mb-10">
        Editor-curated home organisation products we love right now.
      </p>
      {/* ProductGrid component will go here */}
    </section>
  );
}
