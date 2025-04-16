
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
      console.log('Attempting login with:', { email });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Include cookies if any
      });
      
      console.log('Login response status:', response.status);
      
      // Get response body as text first for debugging
      const responseText = await response.text();
      console.log('Login response text:', responseText);
      
      // Parse JSON if it's valid
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing login response:', e);
        throw new Error(`Login failed: Invalid response format`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Login failed: ${response.statusText}`);
      }
      
      console.log('Login successful, token received');
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
