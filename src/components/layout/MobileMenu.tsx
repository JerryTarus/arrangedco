"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Props = {
  pathname: string;
  onClose: () => void;
};

export function MobileMenu({ pathname, onClose }: Props) {
  return (
    <div className="flex h-full flex-col">

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-[#3D3834]/10 px-5 py-4">
        <span className="font-serif text-xl font-semibold leading-none text-terracotta">
          {siteConfig.name}
        </span>
        <button
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile">
        <ul className="space-y-0.5">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-ink hover:bg-ink/[0.05]",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Newsletter CTA ── */}
      <div className="border-t border-[#3D3834]/10 px-5 py-6">
        <Link
          href="/newsletter"
          onClick={onClose}
          className="flex w-full items-center justify-center rounded-xl bg-cta-gradient px-4 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75"
        >
          Subscribe to Newsletter
        </Link>
      </div>

    </div>
  );
}
