
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import LoginForm from '@/components/auth/LoginForm';
import DemoAccounts from '@/components/auth/DemoAccounts';
import AppLogo from '@/components/auth/AppLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { auth, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleDemoLogin = async (demoEmail: string) => {
    if (isSubmitting || isLoading) return;
    
    setEmail(demoEmail);
    setPassword('password123');
    
    try {
      setIsSubmitting(true);
      setLoginError(null);
      
      console.log(`Logging in with demo account: ${demoEmail}`);
      
      const result = await login(demoEmail, 'password123');
      
      if (!result.success) {
        console.error('Demo login error:', result.error);
        setLoginError(`Login failed: ${result.error?.message || 'Authentication failed'}`);
        toast({
          title: "Login Failed",
          description: result.error?.message || "Authentication failed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Logged in successfully",
        });
        // The auth context will handle the redirect
      }
    } catch (error: any) {
      console.error('Demo login catch error:', error);
      setLoginError(error.message || 'An unexpected error occurred');
      toast({
        title: "Login Error",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || isLoading) return;
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      console.log(`Attempting login with email: ${email}`);
      
      const result = await login(email, password);
      
      if (!result.success) {
        console.error('Login error:', result.error);
        setLoginError(result.error?.message || 'Authentication failed');
        toast({
          title: "Login Failed",
          description: result.error?.message || "Authentication failed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Logged in successfully",
        });
        // The auth context will handle the redirect
      }
    } catch (error: any) {
      console.error('Login catch error:', error);
      setLoginError(error.message || 'An unexpected error occurred');
      toast({
        title: "Login Error",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          <AppLogo />
          
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">              
              <LoginForm 
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                loginError={loginError}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />
              
              <DemoAccounts 
                handleDemoLogin={handleDemoLogin}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="py-3 px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} ATOS groupe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
