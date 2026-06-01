import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

// Node.js runtime — enables module-level font caching across warm invocations
// (Edge runtime re-runs cold on every request and can't persist the fetch)
export const runtime = "nodejs";

// ── Font loading ────────────────────────────────────────────────────────────
// Google Fonts with Firefox/27 UA returns WOFF format (not WOFF2).
// Satori (which powers ImageResponse) only supports TTF, OTF, and WOFF.

const GFONTS_CSS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600";
const GFONTS_UA =
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0";

// Module-level cache: persists for the lifetime of a warm Node.js process
let _font: ArrayBuffer | null | undefined = undefined; // undefined = not yet attempted

async function loadSerif(): Promise<ArrayBuffer | null> {
  if (_font !== undefined) return _font;
  try {
    const css = await fetch(GFONTS_CSS, {
      headers: { "User-Agent": GFONTS_UA },
    }).then((r) => r.text());

    // Extract the WOFF src URL from the CSS @font-face block
    const match = /url\(([^)]+)\)\s*format\(['"]woff['"]\)/.exec(css);
    if (!match?.[1]) {
      _font = null;
      return null;
    }

    const fontBuffer = await fetch(match[1]).then((r) => r.arrayBuffer());
    _font = fontBuffer;
    return fontBuffer;
  } catch {
    _font = null;
    return null;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function titleFontSize(title: string): number {
  const len = title.length;
  if (len < 35) return 72;
  if (len < 55) return 60;
  if (len < 75) return 50;
  return 42;
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 1) + "…";
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawTitle = searchParams.get("title") ?? siteConfig.name;
  const category = searchParams.get("category");
  const title = truncate(rawTitle, 120);

  const fontData = await loadSerif();
  const fontFamily = fontData ? '"Cormorant Garamond", serif' : "serif";
  const fontSize = titleFontSize(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FAF8F5",
          position: "relative",
        }}
      >
        {/* ── Main content area ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "52px 64px 0 64px",
          }}
        >
          {/* Wordmark row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily,
                fontSize: 28,
                fontWeight: 600,
                color: "#C4533A",
                letterSpacing: "-0.5px",
              }}
            >
              arranged co
            </span>

            {/* Right: site domain */}
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 18,
                color: "rgba(61,56,52,0.35)",
                letterSpacing: "0.5px",
              }}
            >
              {new URL(siteConfig.url).hostname}
            </span>
          </div>

          {/* Horizontal rule */}
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(61,56,52,0.10)",
              marginTop: 24,
            }}
          />

          {/* ── Article content — centred vertically in the remaining space ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 0,
              paddingBottom: 32,
            }}
          >
            {/* Category badge */}
            {category && (
              <div
                style={{
                  display: "flex",
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#C4533A",
                    backgroundColor: "rgba(196,83,58,0.09)",
                    borderRadius: 100,
                    padding: "6px 20px",
                    letterSpacing: "0.3px",
                  }}
                >
                  {category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontFamily,
                fontSize,
                fontWeight: 600,
                color: "#3D3834",
                lineHeight: 1.18,
                margin: 0,
                maxWidth: "82%",
                letterSpacing: "-0.5px",
              }}
            >
              {title}
            </h1>
          </div>
        </div>

        {/* ── Bottom gradient accent ── */}
        <div
          style={{
            width: "100%",
            height: 60,
            background: "linear-gradient(90deg, #C4533A 0%, #E8724F 100%)",
            flexShrink: 0,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontData
        ? {
            fonts: [
              {
                name: "Cormorant Garamond",
                data: fontData,
                weight: 600,
                style: "normal",
              },
            ],
          }
        : {}),
    },
  );
}
