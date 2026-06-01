import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { createClient as createDirectSupabase } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getRedis } from "@/lib/redis";

const CACHE_TTL = 3600; // 1 hour

type CachedLink = { destinationUrl: string; id: string };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const redis = getRedis();

  // ── 1. Rate limit (skip when Redis is not configured) ─────────────────────
  if (redis) {
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: true,
    });
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "anonymous";
    const { success } = await ratelimit.limit(`go:${ip}`);
    if (!success) {
      return new NextResponse("Too many requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
  }

  // ── 2. Redis cache lookup ─────────────────────────────────────────────────
  const cacheKey = `link:${slug}`;
  let destinationUrl: string | null = null;
  let linkId: string | null = null;

  if (redis) {
    try {
      const cached = await redis.get<CachedLink>(cacheKey);
      if (cached?.destinationUrl) {
        destinationUrl = cached.destinationUrl;
        linkId = cached.id;
      }
    } catch {
      // Redis unavailable — fall through to Supabase
    }
  }

  // ── 3. Supabase lookup on cache miss ──────────────────────────────────────
  if (!destinationUrl) {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return new NextResponse(null, { status: 404 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("affiliate_links")
      .select("id, destination_url")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data?.destination_url) {
      return new NextResponse(null, { status: 404 });
    }

    destinationUrl = data.destination_url;
    linkId = data.id;

    // Warm the cache (non-blocking — never delays the redirect)
    if (redis) {
      const payload: CachedLink = { destinationUrl, id: linkId };
      redis.set(cacheKey, payload, { ex: CACHE_TTL }).catch(() => null);
    }
  }

  // TypeScript guard — both cache hit and DB hit guarantee non-null here
  if (!destinationUrl) {
    return new NextResponse(null, { status: 404 });
  }

  // ── 4. Async click tracking via increment_click RPC ───────────────────────
  // Uses a cookie-free direct client so this closure is safe to run after
  // the response is dispatched (no Next.js request-context dependency).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (linkId && supabaseUrl && supabaseKey) {
    const capturedId = linkId;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
    const ua = request.headers.get("user-agent") ?? "";
    const referer = request.headers.get("referer") ?? "";

    void Promise.resolve(
      createDirectSupabase(supabaseUrl, supabaseKey).rpc("increment_click", {
        p_link_id: capturedId,
        p_ip_hash: ip,
        p_user_agent: ua,
        p_referer: referer,
      }),
    ).catch(() => null);
  }

  // ── 5. 302 redirect ───────────────────────────────────────────────────────
  return NextResponse.redirect(destinationUrl, { status: 302 });
}
