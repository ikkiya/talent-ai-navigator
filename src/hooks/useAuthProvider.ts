
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, User, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Define the Profile interface based on the database schema
type Profile = Database['public']['Tables']['profiles']['Row'];

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

          // Type assertion for profile data
          const profile = profileData as Profile | null;
          const role = profile?.role as UserRole || 'manager';

          const user: User = {
            id: data.session.user.id,
            username: data.session.user.email?.split('@')[0] || '',
            email: data.session.user.email || '',
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            role: role,
            avatarUrl: profile?.avatar_url || '',
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

            // Type assertion for profile data
            const profile = profileData as Profile | null;
            const role = profile?.role as UserRole || 'manager';

            const user: User = {
              id: session.user.id,
              username: session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              firstName: profile?.first_name || '',
              lastName: profile?.last_name || '',
              role: role,
              avatarUrl: profile?.avatar_url || '',
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
    } catch (error: any) {
      console.error('Login error:', error);
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to sign in',
      }));
      
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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
