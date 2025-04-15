
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  email: string;
  password: string;
  loginError: string | null;
  isSubmitting: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  setEmail, 
  setPassword, 
  email, 
  password, 
  loginError, 
  isSubmitting 
}) => {
  const { auth } = useAuth();

  return (
    <div className="space-y-4">              
      {(auth.error || loginError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{auth.error || loginError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-xs text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default LoginForm;
