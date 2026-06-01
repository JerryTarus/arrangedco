import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  // ── Parse + validate ──────────────────────────────────────────────────────
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 },
    );
  }

  const { email, source = "website" } = parsed.data;
  const supabaseReady =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const beehiivReady =
    !!process.env.BEEHIIV_PUBLICATION_ID && !!process.env.BEEHIIV_API_KEY;

  // ── 1. Persist to newsletter_subscribers ─────────────────────────────────
  // Upsert: silently no-ops on duplicate email (ignoreDuplicates).
  // RLS policy "Anyone can subscribe" (INSERT WITH CHECK true) must be set
  // on newsletter_subscribers in Supabase for the anon key to succeed.
  let savedToDb = false;
  if (supabaseReady) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("newsletter_subscribers").upsert(
        {
          email,
          source,
          status: beehiivReady ? "pending" : "active",
        } as const,
        { onConflict: "email", ignoreDuplicates: true },
      );
      if (!error) savedToDb = true;
    } catch {
      // Non-fatal: continue to beehiiv
    }
  }

  // ── 2. Forward to beehiiv (optional) ─────────────────────────────────────
  if (beehiivReady) {
    const pubId = process.env.BEEHIIV_PUBLICATION_ID!;
    const apiKey = process.env.BEEHIIV_API_KEY!;

    let beehiivOk = false;
    try {
      const res = await fetch(
        `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            reactivate_existing: true,
            send_welcome_email: true,
            utm_source: source,
          }),
        },
      );
      beehiivOk = res.ok;
    } catch {
      // Network error — treat as failure
    }

    if (!beehiivOk) {
      // Beehiiv was configured but failed. If we at least saved locally,
      // report success (subscriber is stored and can be synced later).
      if (savedToDb) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { error: "Subscription failed — please try again" },
        { status: 500 },
      );
    }

    // Beehiiv confirmed: promote local record from pending → active
    if (savedToDb && supabaseReady) {
      createClient()
        .then((sb) =>
          sb
            .from("newsletter_subscribers")
            .update({ status: "active" })
            .eq("email", email),
        )
        .catch(() => null);
    }
  }

  // ── 3. Response ───────────────────────────────────────────────────────────
  // Success if saved to DB, or forwarded to beehiiv, or neither is configured
  // (development mode — don't block the UI).
  if (!supabaseReady && !beehiivReady) {
    // Nothing configured — succeed silently so the UI is testable locally
    return NextResponse.json({ success: true });
  }

  if (!savedToDb && !beehiivReady) {
    return NextResponse.json(
      { error: "Subscription failed — please try again" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
