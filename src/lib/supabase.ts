
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gitnpdgfqzovzvivscme.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdG5wZGdmcXpvdnp2aXZzY21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjgwODcsImV4cCI6MjA1OTM0NDA4N30._YLUYQz30ffm2FODsE5hz4YezbVxYI-xJLjnblSkCRQ';

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
