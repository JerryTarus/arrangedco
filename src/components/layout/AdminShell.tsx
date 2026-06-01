"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Package,
  Link2,
  ImageIcon,
  Tag,
  Mail,
  BarChart2,
  Globe,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ── Navigation structure ──────────────────────────────────────────────────

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavGroup = {
  label: string | null;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Posts", href: "/admin/posts", icon: FileText },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Affiliate Links", href: "/admin/links", icon: Link2 },
      { label: "Media", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "Site",
    items: [
      { label: "Categories", href: "/admin/categories", icon: Tag },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
      { label: "SEO", href: "/admin/seo", icon: Globe },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

// ── Top-bar page config ───────────────────────────────────────────────────

type PageConfig = {
  title: string;
  action?: { label: string; href: string };
};

const pageConfigs: Record<string, PageConfig> = {
  "/admin/dashboard": { title: "Dashboard" },
  "/admin/posts": {
    title: "Posts",
    action: { label: "New post", href: "/admin/posts/new" },
  },
  "/admin/posts/new": { title: "New post" },
  "/admin/products": { title: "Products" },
  "/admin/links": { title: "Affiliate Links" },
  "/admin/media": { title: "Media" },
  "/admin/categories": { title: "Categories" },
  "/admin/newsletter": { title: "Newsletter" },
  "/admin/analytics": { title: "Analytics" },
  "/admin/seo": { title: "SEO overrides" },
  "/admin/settings": { title: "Settings" },
};

function getPageConfig(pathname: string): PageConfig {
  if (pageConfigs[pathname]) return pageConfigs[pathname];
  // Dynamic sub-routes like /admin/posts/[id]
  for (const [path, config] of Object.entries(pageConfigs)) {
    if (pathname.startsWith(path + "/")) {
      return { title: config.title };
    }
  }
  return { title: "Admin" };
}

// ── Component ─────────────────────────────────────────────────────────────

type Props = {
  children: React.ReactNode;
  userEmail: string;
};

export function AdminShell({ children, userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { title, action } = getPageConfig(pathname);
  const initials = userEmail ? userEmail[0].toUpperCase() : "A";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
  }

  // Determines if a nav item is "active" — exact for most, prefix for sub-pages
  function isActive(href: string) {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF8F5]">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-[#FAF8F5]",
          "border-r border-ink/[0.07] transition-transform duration-200",
          "md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* ── Logo ── */}
        <div className="flex h-14 items-center border-b border-ink/[0.07] px-5">
          <Link
            href="/admin/dashboard"
            className="font-serif text-[1.1rem] font-semibold leading-none text-terracotta"
            onClick={() => setSidebarOpen(false)}
          >
            arranged co
          </Link>
          <button
            className="ml-auto text-ink/40 hover:text-ink/70 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
          {navGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-5" : ""}>
              {group.label && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-ink/30">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-terracotta/[0.09] text-terracotta"
                            : "text-ink/60 hover:bg-ink/[0.05] hover:text-ink",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active ? "text-terracotta" : "text-ink/40",
                          )}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── User + Logout ── */}
        <div className="border-t border-ink/[0.07] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            {/* Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-[11px] font-semibold text-terracotta">
              {initials}
            </div>
            {/* Email */}
            <span className="flex-1 truncate text-xs text-ink/50">
              {userEmail}
            </span>
            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Sign out"
              className="shrink-0 text-ink/30 transition-colors hover:text-terracotta"
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ── Top bar ── */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink/[0.07] bg-[#FAF8F5]/95 px-4 backdrop-blur-[6px] sm:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile) */}
            <button
              className="shrink-0 text-ink/50 transition-colors hover:text-ink md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="text-[0.95rem] font-semibold text-ink">{title}</h1>
          </div>

          {/* Primary action button */}
          {action && (
            <Link
              href={action.href}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cta-gradient px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:opacity-75"
            >
              <Plus className="h-3.5 w-3.5" />
              {action.label}
            </Link>
          )}
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto">{children}</main>

      </div>
    </div>
  );
}
