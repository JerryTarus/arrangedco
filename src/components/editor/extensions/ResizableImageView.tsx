"use client";

import { useRef } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { cn } from "@/lib/utils";

export function ResizableImageView({
  node,
  selected,
  updateAttributes,
}: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const { src, alt, title, width } = node.attrs as {
    src: string;
    alt: string | null;
    title: string | null;
    width: number | null;
  };

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = imgRef.current?.offsetWidth ?? 400;

    function onMove(ev: MouseEvent) {
      const newW = Math.max(80, startW + (ev.clientX - startX));
      updateAttributes({ width: newW });
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  return (
    <NodeViewWrapper>
      <div
        contentEditable={false}
        className={cn(
          "relative my-4 inline-block max-w-full",
          selected && "ring-2 ring-[#C4533A]/40 ring-offset-2 rounded-2xl",
        )}
        style={{ width: width ? `${width}px` : "100%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt ?? ""}
          title={title ?? undefined}
          className="rounded-2xl block max-w-full"
          style={{ width: "100%", height: "auto" }}
          draggable={false}
        />

        {/* Resize handle — visible only when selected */}
        {selected && (
          <div
            onMouseDown={startResize}
            className="absolute -right-1 top-1/2 -translate-y-1/2 h-10 w-2.5 cursor-ew-resize rounded-full bg-[#C4533A] opacity-75 shadow-sm hover:opacity-100"
            title="Drag to resize"
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}
