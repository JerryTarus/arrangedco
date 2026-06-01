"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function NewsletterSidebar() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "sidebar" }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl p-5">
      {/* Dark espresso gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A2420] via-[#31271F] to-[#3D3834]" />
      {/* Warm blobs — visible through the glass-like overlay */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-terracotta/[0.20] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-coral/[0.14] blur-xl" />

      <div className="relative space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FAF8F5]/45">
          Newsletter
        </p>
        <h3 className="font-serif text-[1.15rem] font-semibold text-[#FAF8F5]">
          Weekly edits
        </h3>
        <p className="text-sm leading-relaxed text-[#FAF8F5]/50">
          The best home picks and organisation ideas, every week.
        </p>

        {status === "success" ? (
          <div className="pt-1 space-y-1">
            <p className="font-medium text-[#FAF8F5]">You&apos;re in!</p>
            <p className="text-sm text-[#FAF8F5]/45">
              Check your inbox to confirm.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2 pt-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className="h-9 w-full rounded-lg border border-white/[0.12] bg-white/[0.08] px-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/30 outline-none transition-colors focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-cta-gradient text-xs font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  Subscribe <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs text-red-400">
            Something went wrong — please try again.
          </p>
        )}

        <p className="text-[10px] text-[#FAF8F5]/25">
          No spam. Unsubscribe any time.
        </p>
      </div>
    </div>
  );
}
