import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates and returns a Supabase browser-side client instance.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
