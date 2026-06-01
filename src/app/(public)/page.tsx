import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { ProductStrip } from "@/components/home/ProductStrip";
import { NewsletterBand } from "@/components/home/NewsletterBand";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata();

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedArticles />
      <ProductStrip />
      <NewsletterBand />
    </>
  );
}
