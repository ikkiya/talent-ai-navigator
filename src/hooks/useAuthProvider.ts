
import { useSession } from './useSession';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useAuthProvider() {
  const { toast } = useToast();
  const auth = useSession();

  const login = async (email: string, password: string) => {
    try {
      auth.isLoading = true;
      auth.error = null;
      
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
