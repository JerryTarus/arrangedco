"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-playfair text-4xl font-bold mb-4">
          Weekly picks in your inbox
        </h2>
        <p className="text-slate-300 mb-8">
          No spam. Just the best home organisation finds, straight to you.
        </p>
        {status === "success" ? (
          <p className="text-green-400 font-medium">You&apos;re in! Check your inbox.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-white text-slate-900 hover:bg-slate-100 shrink-0"
            >
              {status === "loading" ? "…" : "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
