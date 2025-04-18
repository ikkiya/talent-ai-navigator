import { useSession } from './useSession';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { post } from '@/lib/api-client';

const API_URL = 'http://localhost:8080/api';

export function useAuthProvider() {
  const { toast } = useToast();
  const auth = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log("Auth provider initialized, auth state:", auth);
  }, [auth]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log(`Attempting to login with email: ${email}`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        mode: 'cors',
      });
      
      console.log("Login response status:", response.status);
      
      let data;
      try {
        data = await response.json();
        console.log("Login response data:", data);
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
        console.error("Login failed:", errorMessage);
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { success: false, error: new Error(errorMessage) };
      }
      
      // Store token in localStorage
      console.log("Storing auth tokens");
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // Store user data if available
      if (data.user) {
        console.log("User data received:", data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Force update session
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
      
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
      });
      
      return { success: true, user: data.user, error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error, user: null };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
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
      localStorage.removeItem('user');
      
      // Force update session
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
      
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully",
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
