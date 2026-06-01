import { NextRequest, NextResponse } from "next/server";
import { resolveAffiliateLink, trackClick } from "@/lib/affiliate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const link = await resolveAffiliateLink(slug);

  if (!link || !link.destination_url) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Fire-and-forget click tracking
  trackClick(link.id, request).catch(() => null);

  return NextResponse.redirect(link.destination_url, { status: 302 });
}
