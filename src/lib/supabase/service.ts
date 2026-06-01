import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Service role client — bypasses Row Level Security.
// Only use on the server (never expose the key to the client).
// Returns null when SUPABASE_SERVICE_ROLE_KEY is not configured
// so callers can degrade gracefully in local / staging environments.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
