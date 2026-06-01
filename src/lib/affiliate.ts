import { createClient } from "@/lib/supabase/server";

export async function resolveAffiliateLink(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("affiliate_links")
    .select("destination_url, id")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function trackClick(linkId: string, request: Request) {
  const supabase = await createClient();
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const ua = request.headers.get("user-agent") ?? "";
  const referer = request.headers.get("referer") ?? "";

  await supabase.from("link_clicks").insert({
    link_id: linkId,
    ip_hash: ip,
    user_agent: ua,
    referer,
  });
}
