
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, User, UserRole, UserStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Define the Profile interface based on the database schema
type Profile = Database['public']['Tables']['profiles']['Row'];

// Get role from email for demo accounts when profile can't be fetched
const getRoleFromEmail = (email: string): UserRole => {
  if (email.includes('admin')) return 'admin';
  if (email.includes('manager')) return 'manager';
  if (email.includes('mentor')) return 'mentor';
  return 'manager'; // Default role
};

export function useAuthProvider() {
  const { toast } = useToast();
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check for an active session on page load
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          // Get user profile data from your profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (profileError) {
            console.warn('User profile not found:', profileError);
          }

          // Determine user role - from profile or from email for demo accounts
          const email = data.session.user.email || '';
          const profile = profileData as Profile | null;
          
          // If profile exists and has a role, use it; otherwise infer from email
          const role = (profile?.role as UserRole) || getRoleFromEmail(email);

          const user: User = {
            id: data.session.user.id,
            username: email.split('@')[0] || '',
            email: email,
            firstName: profile?.first_name || email.split('@')[0] || '',
            lastName: profile?.last_name || '',
            role: role,
            status: 'active' as UserStatus,
            avatarUrl: profile?.avatar_url || '',
            lastLogin: data.session.user.last_sign_in_at || null,
          };

          setAuth({
            user,
            token: data.session.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // No active session
          setAuth(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        setAuth({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to check authentication status',
        });
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session) {
          // User signed in or token refreshed
          try {
            // Get user profile data
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.warn('User profile not found:', profileError);
            }

            const email = session.user.email || '';
            const profile = profileData as Profile | null;
            
            // If profile exists and has a role, use it; otherwise infer from email
            const role = (profile?.role as UserRole) || getRoleFromEmail(email);

            const user: User = {
              id: session.user.id,
              username: email.split('@')[0] || '',
              email: email,
              firstName: profile?.first_name || email.split('@')[0] || '',
              lastName: profile?.last_name || '',
              role: role,
              status: 'active' as UserStatus,
              avatarUrl: profile?.avatar_url || '',
              lastLogin: session.user.last_sign_in_at || null,
            };

            setAuth({
              user,
              token: session.access_token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            console.error('Profile fetch error:', error);
            setAuth(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          // User signed out
          setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuth(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('Attempting login with:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Auth state will be updated by the onAuthStateChange listener
      localStorage.setItem('token', data.session?.access_token || '');
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to sign in',
      }));
      
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('token');
      // Auth state will be updated by the onAuthStateChange listener
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isAuthorized = (requiredRoles: UserRole[]) => {
    if (!auth.isAuthenticated || !auth.user) return false;
    return requiredRoles.includes(auth.user.role);
  };

  return { auth, login, logout, isAuthorized };
}
