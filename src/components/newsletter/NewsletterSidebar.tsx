"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSidebar() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setDone(true);
  }

  return (
    <div className="rounded-2xl border p-5 space-y-3">
      <h3 className="font-playfair font-bold">Weekly picks</h3>
      <p className="text-xs text-muted-foreground">
        The best home organisation finds, every week.
      </p>
      {done ? (
        <p className="text-xs text-green-600 font-medium">Subscribed! ✓</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-sm"
          />
          <Button type="submit" size="sm" className="w-full">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
}
