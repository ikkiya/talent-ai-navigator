
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the client from the central location
export const supabase = supabaseClient;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return true; // We're now using the direct import, so it's always configured
};
