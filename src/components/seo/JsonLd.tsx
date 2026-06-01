import { siteConfig } from "@/config/site";
import type { Post } from "@/types";

type Props =
  | { type: "article"; post: Post }
  | { type: "breadcrumb"; items: { name: string; href: string }[] };

export function JsonLd(props: Props) {
  let schema: Record<string, unknown>;

  if (props.type === "article") {
    const { post } = props;
    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt ?? "",
      image: post.featured_image ?? siteConfig.ogImage,
      datePublished: post.published_at,
      dateModified: post.updated_at,
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/blog/${post.slug}`,
      },
    };
  } else {
    schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: props.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: `${siteConfig.url}${item.href}`,
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
