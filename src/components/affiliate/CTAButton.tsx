"use client";

import { trackAffiliateClick } from "@/lib/analytics";

type Props = {
  slug: string;
  productName: string;
  label?: string;
  className?: string;
};

export function CTAButton({
  slug,
  productName,
  label = "View on Amazon",
  className,
}: Props) {
  return (
    <a
      href={`/api/go/${slug}`}
      target="_blank"
      rel="nofollow noopener sponsored"
      onClick={() => trackAffiliateClick(productName, `/api/go/${slug}`)}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:brightness-110 transition-all ${className ?? ""}`}
    >
      {label}
      <span aria-hidden>→</span>
    </a>
  );
}
