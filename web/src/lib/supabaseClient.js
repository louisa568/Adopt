import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Supabase 未配置：请在 web/.env 中设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY"
    );
  }

  return supabase;
}
