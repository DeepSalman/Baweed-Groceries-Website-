import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

// For backward compatibility with direct import
export const supabase = {
  from: (table: string) => {
    return getSupabaseClient().from(table);
  },
  auth: {
    signUp: (credentials: any) => getSupabaseClient().auth.signUp(credentials),
    signInWithPassword: (credentials: any) => getSupabaseClient().auth.signInWithPassword(credentials),
    signOut: () => getSupabaseClient().auth.signOut(),
    getSession: () => getSupabaseClient().auth.getSession(),
    getUser: () => getSupabaseClient().auth.getUser(),
    onAuthStateChange: (cb: any) => getSupabaseClient().auth.onAuthStateChange(cb),
  },
} as any;
