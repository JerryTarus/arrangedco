import Image from "next/image";
import { ExternalLink } from "lucide-react";

type Props = {
  productName: string;
  productImage: string | null;
  price: string | null;
  merchant: string | null;
  affiliateSlug: string;
  description?: string | null;
};

export function AffiliateProductCard({
  productName,
  productImage,
  price,
  merchant,
  affiliateSlug,
  description,
}: Props) {
  const href = `/api/go/${affiliateSlug}`;

  return (
    <aside className="my-8 flex flex-col overflow-hidden rounded-2xl border border-[#3D3834]/[0.08] bg-white shadow-card sm:flex-row">
      {/* Product image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-44">
        {productImage ? (
          <Image
            src={productImage}
            alt={productName}
            fill
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FAF8F5] to-[#EDE8E2]">
            <div className="h-14 w-14 rounded-full bg-terracotta/20" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        {merchant && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-terracotta">
            {merchant}
          </p>
        )}
        <h3 className="font-serif text-[1.05rem] font-semibold leading-snug text-ink">
          {productName}
        </h3>
        {description && (
          <p className="text-sm leading-relaxed text-ink/55 line-clamp-2">
            {description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          {price ? (
            <span className="text-base font-semibold text-ink">{price}</span>
          ) : (
            <span />
          )}
          <a
            href={href}
            target="_blank"
            rel="nofollow noopener sponsored"
            className="inline-flex items-center gap-1.5 rounded-xl bg-cta-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75"
          >
            View on Amazon <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
