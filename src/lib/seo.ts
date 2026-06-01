import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
};

export function buildMetadata({
  title,
  description,
  image,
  noIndex,
  canonicalUrl,
}: SeoProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDesc = description ?? siteConfig.description;
  const metaImage = image ?? siteConfig.ogImage;

  return {
    title: metaTitle,
    description: metaDesc,
    robots: noIndex ? "noindex,nofollow" : "index,follow",
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: [{ url: metaImage, width: 1200, height: 630 }],
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: [metaImage],
    },
  };
}
