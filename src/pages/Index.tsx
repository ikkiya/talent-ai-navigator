
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

const Index = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Initializing application...');
  
  useEffect(() => {
    console.log('Index page loaded');
    
    // Check if Supabase is configured
    const supabaseConfigured = isSupabaseConfigured();
    console.log('Supabase configured:', supabaseConfigured);
    
    if (!supabaseConfigured) {
      console.log('Supabase not configured, redirecting to login');
      setStatus('Redirecting to login page...');
      navigate('/login');
      return;
    }
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    if (token) {
      console.log('User has token, redirecting to dashboard');
      setStatus('Redirecting to dashboard...');
      navigate('/dashboard');
    } else {
      console.log('No token found, redirecting to login');
      setStatus('Redirecting to login page...');
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="text-center flex flex-col items-center animate-fade-in">
        <Sparkles className="h-12 w-12 text-brand-blue animate-pulse" />
        <h1 className="text-3xl font-bold mt-4">TalentNavigator</h1>
        <p className="text-muted-foreground mt-2">AI-Powered Employee Management</p>
        <p className="text-muted-foreground mt-1">{status}</p>
      </div>
    </div>
  );
};

export default Index;
