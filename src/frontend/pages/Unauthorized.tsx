import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md animate-fade-in">
          <ShieldAlert className="h-24 w-24 text-destructive mx-auto" />
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Unauthorized</h1>
            <h2 className="text-2xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Dashboard
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

export default Unauthorized;
