
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the client from the central location
export const supabase = supabaseClient;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return Boolean(supabaseUrl && supabaseKey);
};
