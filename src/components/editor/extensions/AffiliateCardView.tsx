"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Package, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function AffiliateCardView({ node, selected }: NodeViewProps) {
  const { productName, productImage, price, merchant, affiliateSlug } =
    node.attrs as {
      productName: string;
      productImage: string | null;
      price: string | null;
      merchant: string | null;
      affiliateSlug: string;
    };

  return (
    <NodeViewWrapper>
      <div
        contentEditable={false}
        className={cn(
          "not-prose my-4 flex cursor-default select-none flex-col overflow-hidden rounded-2xl border border-[#3D3834]/[0.10] bg-white",
          "sm:flex-row",
          selected && "ring-2 ring-[#C4533A]/30",
        )}
      >
        {/* Product image */}
        <div className="flex h-36 w-full shrink-0 items-center justify-center bg-gradient-to-br from-[#FAF8F5] to-[#EDE8E2] sm:h-auto sm:w-36">
          {productImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={productImage}
              alt={productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package className="h-10 w-10 text-[#C4533A]/25" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1 p-4">
          {merchant && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C4533A]">
              {merchant}
            </p>
          )}
          <p className="font-serif text-[1rem] font-semibold leading-snug text-[#3D3834]">
            {productName || "Affiliate product"}
          </p>
          {price && (
            <p className="text-sm font-semibold text-[#3D3834]">{price}</p>
          )}
          <div className="mt-auto pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-cta-gradient">
              {affiliateSlug ? `View → /go/${affiliateSlug}` : "View on Amazon"}
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
