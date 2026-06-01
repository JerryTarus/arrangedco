import { createClient } from "@/lib/supabase/server";

export default async function CategoriesAdminPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <ul className="divide-y border rounded-xl">
        {(categories ?? []).map((cat) => (
          <li key={cat.id} className="px-4 py-3 flex items-center justify-between">
            <span className="font-medium">{cat.name}</span>
            <span className="text-sm text-muted-foreground">{cat.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
