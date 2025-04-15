
import { useSession } from './useSession';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { post } from '@/lib/api-client';

const API_URL = 'http://localhost:8080/api';

export function useAuthProvider() {
  const { toast } = useToast();
  const auth = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Get the refresh token if present to invalidate it
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          await post('auth/logout', { refreshToken });
        } catch (error) {
          console.error('Error during server logout:', error);
        }
      }
      
      // Always clear local storage regardless of server response
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
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

  return { auth, login, logout, isAuthorized, isLoading };
}
