"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, ShoppingBag, Link as LinkIcon,
  Tag, Image, Mail, BarChart2, Search, Settings, LogOut,
} from "lucide-react";
import { adminNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, FileText, ShoppingBag, Link: LinkIcon,
  Tag, Image, Mail, BarChart2, Search, Settings,
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 shrink-0 border-r bg-muted/20 flex flex-col">
        <div className="h-14 flex items-center px-4 border-b font-playfair font-bold text-sm">
          Arranged Co Admin
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {adminNav.map((item) => {
            const Icon = iconMap[item.icon] ?? LayoutDashboard;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-4 text-sm text-muted-foreground hover:text-foreground transition-colors border-t"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
