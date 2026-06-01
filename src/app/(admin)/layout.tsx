import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/layout/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // When Supabase is not yet configured (empty .env.local), render children
  // bare so the login page is accessible and the dev server doesn't crash.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return <>{children}</>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated: render children without AdminShell.
  //   • /admin       → login page renders as-is (no sidebar, no loop)
  //   • /admin/*     → middleware already redirected to /admin before reaching here
  if (!user) return <>{children}</>;

  // Authenticated: wrap every admin page with the persistent shell.
  // The login page (/admin) redirects to /admin/dashboard client-side
  // when it detects an active session.
  return (
    <AdminShell userEmail={user.email ?? ""}>{children}</AdminShell>
  );
}
