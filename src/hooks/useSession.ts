
import { useState, useEffect } from 'react';
import { AuthState, User, UserStatus } from '@/types';
import { get } from '@/lib/api-client';

const API_URL = 'http://localhost:8080/api';

export function useSession() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Function to check session
    const checkSession = async () => {
      console.log("Checking session...");
      
      try {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');
        
        // If no token, set as unauthenticated
        if (!token) {
          console.log("No token found, user is not authenticated");
          setAuth(prev => ({ 
            ...prev, 
            isAuthenticated: false, 
            isLoading: false,
            user: null
          }));
          return;
        }
        
        // If we have a stored user, use it immediately to prevent flashing
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser) as User;
            console.log("Using stored user data:", userData);
            setAuth({
              user: userData,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (e) {
            console.error("Error parsing stored user data:", e);
          }
        }
        
        try {
          // Attempt to get current user data from API
          console.log("Fetching user data from API");
          const userData = await get<User>('auth/me');
          
          console.log("User data fetched successfully:", userData);
          setAuth({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error("Error fetching user data:", error);
          
          // Try to refresh token if current token is invalid
          if (refreshToken) {
            try {
              console.log("Attempting to refresh token");
              const response = await fetch(`${API_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
              });
              
              if (response.ok) {
                const data = await response.json();
                console.log("Token refreshed successfully");
                
                localStorage.setItem('token', data.token);
                if (data.refreshToken) {
                  localStorage.setItem('refreshToken', data.refreshToken);
                }
                
                // Retry getting user data with new token
                const userData = await get<User>('auth/me');
                
                console.log("User data fetched after token refresh:", userData);
                setAuth({
                  user: userData,
                  token: data.token,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
                
                // Update stored user data
                localStorage.setItem('user', JSON.stringify(userData));
                return;
              } else {
                console.error("Token refresh failed");
              }
            } catch (refreshError) {
              console.error('Token refresh error:', refreshError);
            }
          }
          
          // If refresh failed or no refresh token, clear auth
          console.log("Authentication failed, clearing session");
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please log in again.',
          });
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        setAuth({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to check authentication status',
        });
      }
    };

    // Check session on mount
    checkSession();
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      console.log("Storage changed, rechecking session");
      checkSession();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Setup interval to refresh session
    const intervalId = setInterval(() => {
      if (localStorage.getItem('token')) {
        console.log("Refreshing session (interval)");
        checkSession();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Debug auth state changes
  useEffect(() => {
    console.log("Auth state updated:", {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      hasUser: !!auth.user,
      userRole: auth.user?.role,
      error: auth.error
    });
  }, [auth]);

  return auth;
}
