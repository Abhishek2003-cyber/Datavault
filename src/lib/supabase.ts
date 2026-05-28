import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side / Public usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side / Admin usage (Use cautiously, bypasses RLS)
export const getSupabaseAdmin = () => {
  if (!supabaseServiceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to anon client.");
    return supabase;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
};
