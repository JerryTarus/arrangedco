"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { Button } from "@/components/ui/button";

type Props = { open: boolean; onClose: () => void };

export function MobileMenu({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <nav className="relative ml-auto w-64 bg-background h-full shadow-xl p-6 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="self-end mb-4"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="text-base py-2 px-3 rounded-md hover:bg-accent transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
