
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
    // Check for an active session on page load
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!token) {
          setAuth(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        try {
          // Attempt to get current user data
          const userData = await get<User>('auth/me');
          
          setAuth({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Try to refresh token if current token is invalid
          if (refreshToken) {
            try {
              const response = await fetch(`${API_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
              });
              
              if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                if (data.refreshToken) {
                  localStorage.setItem('refreshToken', data.refreshToken);
                }
                
                // Retry getting user data with new token
                const userData = await get<User>('auth/me');
                
                setAuth({
                  user: userData,
                  token: data.token,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
                return;
              }
            } catch (refreshError) {
              console.error('Token refresh error:', refreshError);
            }
          }
          
          // If refresh failed or no refresh token, clear auth
          console.error('Session error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
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
    
    // Setup interval to refresh session
    const intervalId = setInterval(() => {
      if (localStorage.getItem('token')) {
        checkSession();
      }
    }, 10 * 60 * 1000); // Check every 10 minutes
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return auth;
}
