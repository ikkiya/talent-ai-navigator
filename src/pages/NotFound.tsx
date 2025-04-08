
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md animate-fade-in">
          <AlertCircle className="h-24 w-24 text-muted-foreground mx-auto" />
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
      <footer className="py-3 px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} ATOS groupe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NotFound;
