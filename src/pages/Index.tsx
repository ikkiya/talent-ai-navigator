
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Initializing application...');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log('Index page loaded - starting initialization');
    
    // Allow the loading state to be visible for a moment
    const initTimer = setTimeout(() => {
      try {
        // Check if Supabase is configured
        const supabaseConfigured = isSupabaseConfigured();
        console.log('Supabase configured:', supabaseConfigured);
        
        if (!supabaseConfigured) {
          console.log('Supabase not configured, redirecting to login');
          setStatus('Redirecting to login page...');
          setTimeout(() => navigate('/login'), 1000);
          return;
        }
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        
        if (token) {
          console.log('User has token, redirecting to dashboard');
          setStatus('Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          console.log('No token found, redirecting to login');
          setStatus('Redirecting to login page...');
          setTimeout(() => navigate('/login'), 1000);
        }
      } catch (err) {
        console.error('Error during initialization:', err);
        setError(`Initialization error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setStatus('Error occurred during initialization');
        setIsLoading(false);
      }
    }, 1500); // Show loading state for at least 1.5 seconds
    
    return () => clearTimeout(initTimer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center flex flex-col items-center animate-fade-in">
          <Sparkles className="h-12 w-12 text-brand-blue animate-pulse" />
          <h1 className="text-3xl font-bold mt-4">TalentNavigator</h1>
          <p className="text-muted-foreground mt-2">AI-Powered Employee Management</p>
          
          {isLoading ? (
            <div className="mt-6 space-y-2 w-48">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ) : (
            <p className="text-muted-foreground mt-1">{status}</p>
          )}
          
          {error && (
            <p className="text-destructive mt-2 max-w-md">{error}</p>
          )}
        </div>
      </div>
      <footer className="py-3 px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} ATOS groupe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
