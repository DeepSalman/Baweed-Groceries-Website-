import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that gracefully handles missing config
    return {
      from: () => ({ select: () => Promise.resolve({ data: null, error: null }) }),
      auth: {
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: (cb: any) => {
          return { data: { subscription: null }, error: null };
        },
      },
    } as any;
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
    onAuthStateChange: (cb: any) => {
      const result = getSupabaseClient().auth.onAuthStateChange(cb);
      return result || { data: { subscription: null } };
    },
  },
} as any;
