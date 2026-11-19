import "server-only";

import { createClient } from "./server";

/** Returns the cookie-aware Supabase client only for a verified admin user. */
export async function getAdminSupabaseClient() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || user?.app_metadata?.role !== "admin") {
      return null;
    }

    return supabase;
  } catch {
    return null;
  }
}
