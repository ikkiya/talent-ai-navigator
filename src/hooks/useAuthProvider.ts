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
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      console.log('Login response status:', response.status);
      
      const responseText = await response.text();
      console.log('Login response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing login response:', e);
        toast({
          title: "Login Error",
          description: "Invalid response format from server",
          variant: "destructive",
        });
        return { success: false, error: new Error("Invalid response format") };
      }
      
      if (!response.ok) {
        const errorMessage = data.message || `Login failed: ${response.statusText}`;
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { success: false, error: new Error(errorMessage) };
      }
      
      console.log('Login successful, token received');
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
        variant: "default",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          await post('auth/logout', { refreshToken });
        } catch (error) {
          console.error('Error during server logout:', error);
        }
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully",
        variant: "default",
      });
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
