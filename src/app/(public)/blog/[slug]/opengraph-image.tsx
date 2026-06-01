import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .single();

  const title = data?.title ?? siteConfig.name;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "60px",
        }}
      >
        <p style={{ color: "#94a3b8", fontSize: 20, marginBottom: 16 }}>
          {siteConfig.name}
        </p>
        <h1
          style={{
            color: "white",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: "80%",
          }}
        >
          {title}
        </h1>
      </div>
    ),
    { ...size },
  );
}
