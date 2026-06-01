import { DashboardStats } from "@/components/admin/DashboardStats";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: postCount }, { count: linkCount }] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("affiliate_links").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardStats postCount={postCount ?? 0} linkCount={linkCount ?? 0} />
    </div>
  );
}
