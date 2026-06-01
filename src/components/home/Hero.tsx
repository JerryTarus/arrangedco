import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-24 md:py-36 relative z-10">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-4">
          Home Organisation & Lifestyle
        </p>
        <h1 className="font-playfair text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-3xl">
          A place for everything.
        </h1>
        <p className="text-lg text-slate-300 max-w-xl mb-10">
          Curated product guides, organisation tips, and honest recommendations to
          help you build a home that works.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100"
            render={<Link href="/blog" />}
          >
            Read the guides
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            render={<Link href="/shop" />}
          >
            Shop top picks
          </Button>
        </div>
      </div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
    </section>
  );
}
