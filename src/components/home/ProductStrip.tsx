import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/affiliate/ProductCard";
import type { Product } from "@/types";

type ProductWithLink = Product & {
  affiliate_links: { slug: string; destination_url: string } | null;
};

export async function ProductStrip() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, affiliate_links(slug, destination_url)")
      .eq("is_featured", true)
      .limit(8);

    const products = data as ProductWithLink[] | null;
    if (!products?.length) return null;

    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-semibold mb-8 text-ink">
            This week&apos;s top picks
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {products.map((product) => (
              <div key={product.id} className="shrink-0 w-56">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}
