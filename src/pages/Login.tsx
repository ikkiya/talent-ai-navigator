
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleDemoLogin = async (demoEmail: string) => {
    if (isSubmitting) return;
    
    setEmail(demoEmail);
    setPassword('password123');
    
    try {
      setIsSubmitting(true);
      setLoginError(null);
      
      console.log(`Logging in with demo account: ${demoEmail}`);
      
      // Use direct Supabase auth to debug the issue
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: 'password123',
      });
      
      if (error) {
        console.error('Demo login error:', error);
        setLoginError(error.message);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.user) {
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
    
    if (isSubmitting) return;
    
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
      
      // Use direct Supabase auth to debug the issue
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        setLoginError(error.message);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.user) {
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

  if (auth.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">TalentNavigator</h1>
          </div>
          <p className="text-muted-foreground">AI-Powered Employee & Team Management</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">              
              {(auth.error || loginError) && (
                <Alert variant="destructive">
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
              
              <div className="text-sm">
                <p className="font-medium">Demo Accounts:</p>
                <div className="grid gap-2 mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs justify-start h-8"
                    onClick={() => handleDemoLogin('admin@company.com')}
                    disabled={isSubmitting}
                  >
                    admin@company.com (Admin)
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs justify-start h-8"
                    onClick={() => handleDemoLogin('manager@company.com')}
                    disabled={isSubmitting}
                  >
                    manager@company.com (Manager)
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs justify-start h-8"
                    onClick={() => handleDemoLogin('mentor@company.com')}
                    disabled={isSubmitting}
                  >
                    mentor@company.com (Mentor)
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
