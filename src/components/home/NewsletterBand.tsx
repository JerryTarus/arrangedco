"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden">
      {/* Espresso gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A2420] via-[#31271F] to-[#3D3834]" />

      {/* Warm ambient blobs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-terracotta/[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[300px] w-[300px] rounded-full bg-coral/[0.08] blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">

        {/* Overline */}
        <span className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#FAF8F5]/60">
          Newsletter
        </span>

        <h2 className="font-serif text-4xl font-semibold leading-tight text-[#FAF8F5] sm:text-5xl">
          Elevate your inbox
        </h2>

        <p className="mx-auto mt-4 max-w-sm text-[1rem] leading-relaxed text-[#FAF8F5]/50">
          Weekly home edits, product finds, and honest organisation ideas.
          No filler — just the good stuff.
        </p>

        <div className="mt-10">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/20 text-xl">
                ✓
              </div>
              <p className="font-semibold text-[#FAF8F5]">You&apos;re in!</p>
              <p className="text-sm text-[#FAF8F5]/45">Check your inbox to confirm your subscription.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-sm flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === "loading"}
                className="h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/30 outline-none transition-colors focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cta-gradient px-5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-400">
              Something went wrong — please try again.
            </p>
          )}
        </div>

        <p className="mt-5 text-xs text-[#FAF8F5]/25">
          No spam. Unsubscribe any time.
        </p>

      </div>
    </section>
  );
}
