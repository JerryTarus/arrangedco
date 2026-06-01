import { createClient } from "@/lib/supabase/server";
import { LinksTable } from "@/components/admin/LinksTable";
import { Button } from "@/components/ui/button";

export default async function LinksPage() {
  const supabase = await createClient();
  const { data: links } = await supabase
    .from("affiliate_links")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Affiliate Links</h1>
        <Button>Add Link</Button>
      </div>
      <LinksTable links={links ?? []} />
    </div>
  );
}
