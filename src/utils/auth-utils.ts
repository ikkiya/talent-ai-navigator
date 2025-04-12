
import { UserRole } from '@/types';
import { Database } from '@/integrations/supabase/types';

// Define the Profile interface based on the database schema
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Get role from email for demo accounts when profile can't be fetched
export const getRoleFromEmail = (email: string): UserRole => {
  if (email.includes('admin')) return 'admin';
  if (email.includes('manager')) return 'manager';
  if (email.includes('mentor')) return 'mentor';
  return 'manager'; // Default role
};

// Function to create a user object from profile and session data
export const createUserObject = (
  userId: string,
  email: string,
  profile: Profile | null,
  lastSignIn: string | null
) => {
  // If profile exists and has a role, use it; otherwise infer from email
  const role = (profile?.role as UserRole) || getRoleFromEmail(email);

  return {
    id: userId,
    username: email.split('@')[0] || '',
    email: email,
    firstName: profile?.first_name || email.split('@')[0] || '',
    lastName: profile?.last_name || '',
    role: role,
    status: 'active',
    avatarUrl: profile?.avatar_url || '',
    lastLogin: lastSignIn || null,
  };
};
