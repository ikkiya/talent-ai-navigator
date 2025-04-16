
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  email: string;
  password: string;
  loginError: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  setEmail, 
  setPassword, 
  email, 
  password, 
  loginError, 
  isSubmitting,
  onSubmit
}) => {
  const { auth } = useAuth();

  return (
    <form onSubmit={onSubmit} className="space-y-4">              
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
