import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

type Props = {
  products: (Product & { affiliate_links?: { slug: string; destination_url: string } | null })[];
};

export function ProductStrip({ products }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {products.map((product) => (
        <div key={product.id} className="shrink-0 w-52">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
