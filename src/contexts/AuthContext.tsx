
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, UserRole } from '@/types';

interface AuthContextType {
  auth: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthorized: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for initial development
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as UserRole,
    avatarUrl: '',
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@example.com',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager' as UserRole,
    avatarUrl: '',
  },
  {
    id: '3',
    username: 'mentor',
    email: 'mentor@example.com',
    firstName: 'Mentor',
    lastName: 'User',
    role: 'mentor' as UserRole,
    avatarUrl: '',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check if there's a stored token and validate it
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        // In a real app, you would validate the token with your backend
        const user = JSON.parse(storedUser) as User;
        setAuth({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        // If token validation fails, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired. Please login again.',
        });
      }
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // This would be a real API call in production
      // For demo purposes, we use mock data
      setAuth(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by username
      const user = mockUsers.find(u => u.username === username);
      
      // Simple validation (in production, this would be done by your backend)
      if (!user || password !== 'password') {
        throw new Error('Invalid username or password');
      }
      
      // Create a mock JWT token
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuth({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
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
