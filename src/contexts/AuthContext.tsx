
import React, { createContext, useContext } from 'react';
import { AuthState, UserRole } from '@/types';
import { useAuthProvider } from '@/hooks/useAuthProvider';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any; user?: any }>;
  logout: () => void;
  isAuthorized: (requiredRoles: UserRole[]) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authProvider = useAuthProvider();

  return (
    <AuthContext.Provider value={authProvider}>
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
