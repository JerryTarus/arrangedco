import Image from "next/image";
import { CTAButton } from "./CTAButton";
import type { Product } from "@/types";

type Props = {
  product: Product & {
    affiliate_links?: { slug: string; destination_url: string } | null;
  };
};

export function ProductCard({ product }: Props) {
  const slug = product.affiliate_links?.slug;

  return (
    <div className="flex flex-col rounded-2xl border overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <Image
          src={product.image ?? "/placeholders/product-placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.price && (
          <p className="text-sm font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
        )}
        {slug && (
          <CTAButton slug={slug} productName={product.name} className="mt-auto text-xs" />
        )}
      </div>
    </div>
  );
}
