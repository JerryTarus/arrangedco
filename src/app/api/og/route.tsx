import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? siteConfig.name;
  const category = searchParams.get("category");

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
          fontFamily: "Georgia, serif",
        }}
      >
        {category && (
          <p style={{ color: "#94a3b8", fontSize: 20, marginBottom: 12 }}>
            {category}
          </p>
        )}
        <h1
          style={{
            color: "white",
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: "85%",
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p style={{ color: "#64748b", fontSize: 20, marginTop: 24 }}>
          {siteConfig.name}
        </p>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
