
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, User } from '@/types';
import { createUserObject, Profile } from '@/utils/auth-utils';

export function useSession() {
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

          const email = data.session.user.email || '';
          const profile = profileData as Profile | null;
          
          const user = createUserObject(
            data.session.user.id,
            email,
            profile,
            data.session.user.last_sign_in_at
          );

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
            
            const user = createUserObject(
              session.user.id,
              email,
              profile,
              session.user.last_sign_in_at
            );

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

  return auth;
}
