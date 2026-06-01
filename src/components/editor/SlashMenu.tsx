"use client";

import { useEffect, useRef, useState } from "react";
import {
  Package,
  LayoutGrid,
  MousePointerClick,
  Mail,
  ImageIcon,
  Heading2,
  Heading3,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SlashCommand = {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
};

export const SLASH_COMMANDS: SlashCommand[] = [
  { id: "product-card",      label: "Product Card",      description: "Embed an affiliate product",   icon: Package         },
  { id: "comparison-table",  label: "Comparison Table",  description: "Compare products side by side", icon: LayoutGrid      },
  { id: "cta-button",        label: "CTA Button",        description: "Call-to-action button",         icon: MousePointerClick},
  { id: "newsletter",        label: "Newsletter Block",  description: "Inline subscribe prompt",       icon: Mail            },
  { id: "image",             label: "Image",             description: "Upload or embed an image",      icon: ImageIcon       },
  { id: "heading-2",         label: "Heading 2",         description: "Large section heading",         icon: Heading2        },
  { id: "heading-3",         label: "Heading 3",         description: "Medium section heading",        icon: Heading3        },
  { id: "quote",             label: "Quote",             description: "Blockquote",                    icon: Quote           },
];

type Props = {
  query: string;
  position: { top: number; left: number };
  onSelect: (command: SlashCommand) => void;
  onClose: () => void;
};

export function SlashMenu({ query, position, onSelect, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = SLASH_COMMANDS.filter(
    (c) =>
      !query ||
      c.label.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query),
  );

  useEffect(() => { setActiveIndex(0); }, [query]);

  // Keyboard navigation — capture phase so it runs before TipTap handlers
  useEffect(() => {
    const total = Math.max(1, filtered.length);
    function onKeyDown(e: KeyboardEvent) {
      if      (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => (i + 1) % total); }
      else if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex((i) => (i - 1 + total) % total); }
      else if (e.key === "Enter")     { e.preventDefault(); if (filtered[activeIndex]) onSelect(filtered[activeIndex]); }
      else if (e.key === "Escape")    { e.preventDefault(); onClose(); }
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [filtered, activeIndex, onSelect, onClose]);

  useEffect(() => {
    (containerRef.current?.children[activeIndex] as HTMLElement)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!filtered.length) return null;

  return (
    <div style={{ position: "fixed", top: position.top + 8, left: position.left, zIndex: 9999 }}>
      <div
        ref={containerRef}
        className="max-h-72 w-64 overflow-y-auto rounded-xl border border-[#3D3834]/[0.10] bg-white py-1 shadow-xl"
        onMouseDown={(e) => e.preventDefault()}
      >
        {filtered.map((cmd, i) => (
          <button
            key={cmd.id}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onSelect(cmd); }}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
              i === activeIndex
                ? "bg-[#C4533A]/[0.08] text-[#C4533A]"
                : "text-[#3D3834] hover:bg-[#3D3834]/[0.04]",
            )}
          >
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              i === activeIndex ? "bg-[#C4533A]/[0.12]" : "bg-[#3D3834]/[0.06]",
            )}>
              <cmd.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold">{cmd.label}</p>
              <p className={cn("truncate text-[11px]", i === activeIndex ? "text-[#C4533A]/60" : "text-[#3D3834]/45")}>
                {cmd.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
