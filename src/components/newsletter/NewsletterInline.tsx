"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterInline() {
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
    <div className="my-8 rounded-2xl border bg-muted/30 p-6">
      <h3 className="font-playfair text-xl font-bold mb-1">Enjoyed this?</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get weekly picks delivered to your inbox.
      </p>
      {status === "success" ? (
        <p className="text-sm text-green-600 font-medium">You&apos;re subscribed!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={status === "loading"} size="sm">
            {status === "loading" ? "…" : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  );
}
