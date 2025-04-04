
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have the required configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Create a dummy client if URL is missing to prevent runtime errors
// This will allow the app to load, but Supabase functionality won't work
let supabaseClient: ReturnType<typeof createClient<Database>>;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock client that will not make actual API calls
  // This prevents runtime errors while allowing the app to load
  supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase is not configured') }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Supabase is not configured') }),
        }),
      }),
    }),
  } as any;
}

export const supabase = supabaseClient;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
