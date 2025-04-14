
import { useState, useEffect } from 'react';
import { AuthState, User, UserStatus } from '@/types';

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
        
        if (!token) {
          setAuth(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Session invalid');
        }
        
        const userData = await response.json();
        
        setAuth({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
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
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return auth;
}
