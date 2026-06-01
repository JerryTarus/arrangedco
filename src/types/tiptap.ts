import type { Node } from "@tiptap/pm/model";

export type AffiliateCardAttrs = {
  productName: string;
  productImage: string | null;
  price: string | null;
  merchant: string | null;
  affiliateSlug: string;
};

export type CTAButtonAttrs = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type NewsletterBlockAttrs = {
  headline: string;
  subtext: string;
};

export type TiptapNode = Node;
