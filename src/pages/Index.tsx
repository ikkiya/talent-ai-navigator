
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard or login
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="text-center flex flex-col items-center animate-fade-in">
        <Sparkles className="h-12 w-12 text-brand-blue animate-pulse" />
        <h1 className="text-3xl font-bold mt-4">TalentNavigator</h1>
        <p className="text-muted-foreground mt-2">AI-Powered Employee Management</p>
        <p className="text-muted-foreground mt-1">Loading application...</p>
      </div>
    </div>
  );
};

export default Index;
