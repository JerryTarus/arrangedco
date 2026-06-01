import Link from "next/link";
import {
  FileText,
  Package,
  MousePointerClick,
  Mail,
  TrendingUp,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { ClickTrendChart } from "@/components/admin/ClickTrendChart";
import type { TrendPoint } from "@/components/admin/ClickTrendChart";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildTrendData(
  events: { created_at: string }[] | null,
): TrendPoint[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const clicks = (events ?? []).filter((e) =>
      e.created_at.startsWith(dateStr),
    ).length;
    return { date: `${d.getMonth() + 1}/${d.getDate()}`, clicks };
  });
}

function statusVariant(status: string) {
  if (status === "published") return "bg-emerald-50 text-emerald-700";
  if (status === "draft") return "bg-amber-50 text-amber-700";
  return "bg-ink/[0.06] text-ink/60";
}

function subStatusVariant(status: string) {
  if (status === "active") return "bg-emerald-50 text-emerald-700";
  if (status === "pending") return "bg-amber-50 text-amber-700";
  return "bg-ink/[0.06] text-ink/60";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const db = createServiceClient();

  // ── Dates ──────────────────────────────────────────────────────────────────
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // ── Supabase queries (all in parallel) ────────────────────────────────────
  const [
    publishedResult,
    draftResult,
    productsResult,
    monthlyClicksResult,
    subscribersResult,
    recentPostsResult,
    topLinksResult,
    recentSubsResult,
    trendResult,
  ] = db
    ? await Promise.all([
        db
          .from("posts")
          .select("*", { count: "exact", head: true })
          .eq("status", "published"),
        db
          .from("posts")
          .select("*", { count: "exact", head: true })
          .eq("status", "draft"),
        db
          .from("products")
          .select("*", { count: "exact", head: true }),
        db
          .from("click_events")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth.toISOString()),
        db
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        db
          .from("posts")
          .select("id, title, slug, status, published_at, reading_time")
          .order("created_at", { ascending: false })
          .limit(8),
        db
          .from("affiliate_links")
          .select(
            "id, slug, product_name, click_count, destination_url, merchant",
          )
          .order("click_count", { ascending: false })
          .limit(8),
        db
          .from("newsletter_subscribers")
          .select("id, email, status, source, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
        db
          .from("click_events")
          .select("created_at")
          .gte("created_at", thirtyDaysAgo.toISOString()),
      ])
    : ([
        { count: null },
        { count: null },
        { count: null },
        { count: null },
        { count: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null },
      ] as const);

  // ── Derived values ─────────────────────────────────────────────────────────
  const publishedPosts = publishedResult.count ?? 0;
  const draftPosts = draftResult.count ?? 0;
  const totalProducts = productsResult.count ?? 0;
  const monthlyClicks = monthlyClicksResult.count ?? 0;
  const activeSubscribers = subscribersResult.count ?? 0;

  type RecentPost = {
    id: string;
    title: string;
    slug: string;
    status: string;
    published_at: string | null;
    reading_time: number | null;
  };
  type TopLink = {
    id: string;
    slug: string;
    product_name: string;
    click_count: number;
    destination_url: string;
    merchant: string | null;
  };
  type RecentSub = {
    id: string;
    email: string;
    status: string;
    source: string | null;
    created_at: string;
  };

  const recentPosts = (recentPostsResult.data ?? []) as RecentPost[];
  const topLinks = (topLinksResult.data ?? []) as TopLink[];
  const recentSubs = (recentSubsResult.data ?? []) as RecentSub[];
  const trendData = buildTrendData(
    trendResult.data as { created_at: string }[] | null,
  );

  // ── KPI config ──────────────────────────────────────────────────────────────
  const kpis = [
    {
      label: "Published posts",
      value: publishedPosts,
      sub: `${draftPosts} draft${draftPosts !== 1 ? "s" : ""}`,
      icon: FileText,
      href: "/admin/posts",
    },
    {
      label: "Products",
      value: totalProducts,
      sub: "in catalogue",
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Clicks this month",
      value: monthlyClicks,
      sub: `${now.toLocaleString("default", { month: "long" })} total`,
      icon: MousePointerClick,
      href: "/admin/analytics",
    },
    {
      label: "Active subscribers",
      value: activeSubscribers,
      sub: "newsletter",
      icon: Mail,
      href: "/admin/newsletter",
    },
  ];

  const isConfigured = !!db;

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* ── No-config notice ── */}
      {!isConfigured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Supabase service role key is not configured —{" "}
          <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> is
          missing from <code className="font-mono">.env.local</code>. Showing
          empty state.
        </div>
      )}

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="group rounded-2xl bg-white p-5 shadow-card transition-shadow hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                  {kpi.label}
                </p>
                <p className="mt-1.5 text-3xl font-semibold tabular-nums text-ink">
                  {kpi.value.toLocaleString()}
                </p>
                <p className="mt-0.5 text-xs text-ink/35">{kpi.sub}</p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terracotta/[0.08] transition-colors group-hover:bg-terracotta/[0.14]">
                <kpi.icon className="h-4 w-4 text-terracotta" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Chart + Recent subscribers ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* 30-day click trend */}
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-terracotta" />
            <h2 className="text-sm font-semibold text-ink">
              Affiliate clicks — last 30 days
            </h2>
          </div>
          <ClickTrendChart data={trendData} />
        </div>

        {/* Recent subscribers */}
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">
              Recent subscribers
            </h2>
            <Link
              href="/admin/newsletter"
              className="text-xs text-terracotta hover:opacity-70 transition-opacity"
            >
              View all →
            </Link>
          </div>

          {recentSubs.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink/35">
              No subscribers yet
            </p>
          ) : (
            <ul className="space-y-3">
              {recentSubs.map((sub) => (
                <li key={sub.id} className="flex items-center gap-3">
                  {/* Avatar initial */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta/[0.09] text-[11px] font-semibold text-terracotta">
                    {sub.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-ink">
                      {sub.email}
                    </p>
                    <p className="text-[10px] text-ink/35">
                      {formatDate(sub.created_at)}
                      {sub.source ? ` · ${sub.source}` : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      subStatusVariant(sub.status),
                    )}
                  >
                    {sub.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Recent posts ── */}
      <div className="rounded-2xl bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink/[0.07] px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">Recent posts</h2>
          <Link
            href="/admin/posts"
            className="text-xs text-terracotta hover:opacity-70 transition-opacity"
          >
            View all →
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink/35">
            No posts yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/[0.07]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                    Title
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                    Published
                  </th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                    Read&nbsp;time
                  </th>
                  <th className="w-14 py-3" />
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post, i) => (
                  <tr
                    key={post.id}
                    className={cn(
                      "transition-colors hover:bg-ink/[0.02]",
                      i < recentPosts.length - 1 &&
                        "border-b border-ink/[0.05]",
                    )}
                  >
                    <td className="max-w-[280px] px-5 py-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="truncate font-medium text-ink hover:text-terracotta transition-colors block"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                          statusVariant(post.status),
                        )}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-ink/45">
                      {post.published_at ? formatDate(post.published_at) : "—"}
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-ink/45">
                      {post.reading_time ? `${post.reading_time} min` : "—"}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink/50 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Top affiliate links ── */}
      <div className="rounded-2xl bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink/[0.07] px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">
            Top affiliate links
          </h2>
          <Link
            href="/admin/links"
            className="text-xs text-terracotta hover:opacity-70 transition-opacity"
          >
            View all →
          </Link>
        </div>

        {topLinks.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink/35">
            No affiliate links yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/[0.07]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                    Product
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                    Slug
                  </th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                    Clicks
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                    Merchant
                  </th>
                  <th className="w-10 py-3" />
                </tr>
              </thead>
              <tbody>
                {topLinks.map((link, i) => (
                  <tr
                    key={link.id}
                    className={cn(
                      "transition-colors hover:bg-ink/[0.02]",
                      i < topLinks.length - 1 && "border-b border-ink/[0.05]",
                    )}
                  >
                    <td className="max-w-[260px] px-5 py-3">
                      <p className="truncate font-medium text-ink">
                        {link.product_name}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <code className="rounded bg-ink/[0.05] px-1.5 py-0.5 text-[11px] text-ink/60">
                        /go/{link.slug}
                      </code>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-semibold tabular-nums text-ink">
                        {link.click_count.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-ink/45">
                      {link.merchant ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <a
                        href={link.destination_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg p-1.5 text-ink/35 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                        title="Open destination"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
