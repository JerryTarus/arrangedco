import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("title, slug, excerpt")
    .eq("status", "published")
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    .limit(10);

  return NextResponse.json({ results: data ?? [] });
}
