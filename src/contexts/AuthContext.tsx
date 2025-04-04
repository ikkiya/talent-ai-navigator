
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthorized: (requiredRoles: UserRole[]) => boolean;
}

// Create a type for the profile data
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

          const profile = profileData as Profile | null;
          const role = profile?.role || 'manager';

          const user: User = {
            id: data.session.user.id,
            username: data.session.user.email?.split('@')[0] || '',
            email: data.session.user.email || '',
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            role: role as UserRole,
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
      } catch (error) {
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

            const profile = profileData as Profile | null;
            const role = profile?.role || 'manager';

            const user: User = {
              id: session.user.id,
              username: session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              firstName: profile?.first_name || '',
              lastName: profile?.last_name || '',
              role: role as UserRole,
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
    } catch (error) {
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

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
