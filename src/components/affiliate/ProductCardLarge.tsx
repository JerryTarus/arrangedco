import Image from "next/image";
import { CTAButton } from "./CTAButton";
import { AffiliateDisclosure } from "./AffiliateDisclosure";
import type { Product } from "@/types";

type Props = {
  product: Product & {
    affiliate_links?: { slug: string } | null;
  };
};

export function ProductCardLarge({ product }: Props) {
  const slug = product.affiliate_links?.slug;

  return (
    <div className="flex flex-col md:flex-row gap-6 rounded-2xl border p-6 hover:shadow-lg transition-shadow">
      <div className="relative w-full md:w-48 h-48 shrink-0 rounded-xl overflow-hidden bg-muted">
        <Image
          src={product.image ?? "/placeholders/product-placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <h2 className="font-playfair text-xl font-bold">{product.name}</h2>
        {product.description && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>
        )}
        {product.price && (
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
        )}
        {slug && (
          <CTAButton slug={slug} productName={product.name} />
        )}
        <AffiliateDisclosure />
      </div>
    </div>
  );
}
