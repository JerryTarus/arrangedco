"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3D3834]/10 bg-[#FAF8F5]/85 backdrop-blur-[12px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/*
          Three-column grid keeps the wordmark left-anchored,
          nav links truly centered, and CTA right-anchored
          regardless of their respective widths.
        */}
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[72px]">

          {/* ── Wordmark ── */}
          <Link
            href="/"
            className="font-serif text-[1.3rem] font-semibold leading-none tracking-tight text-terracotta"
          >
            {siteConfig.name}
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium tracking-wide transition-colors duration-150",
                  pathname === item.href
                    ? "text-terracotta"
                    : "text-ink/60 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Right: CTA + hamburger ── */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/newsletter"
              className="hidden rounded-xl bg-cta-gradient px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75 md:inline-flex"
            >
              Newsletter
            </Link>

            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-full border-l border-ink/10 bg-[#FAF8F5] p-0 sm:w-[320px]"
                showCloseButton={false}
              >
                <MobileMenu
                  pathname={pathname}
                  onClose={() => setDrawerOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
