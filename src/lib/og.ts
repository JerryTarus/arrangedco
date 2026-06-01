import { siteConfig } from "@/config/site";

export type OgImageParams = {
  title: string;
  category?: string;
  type?: "article" | "product" | "default";
};

export function buildOgImageUrl(params: OgImageParams) {
  const base = `${siteConfig.url}/api/og`;
  const query = new URLSearchParams({
    title: params.title,
    ...(params.category && { category: params.category }),
    ...(params.type && { type: params.type }),
  });
  return `${base}?${query.toString()}`;
}
