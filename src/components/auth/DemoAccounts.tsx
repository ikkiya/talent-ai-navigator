
import React from 'react';
import { Button } from '@/components/ui/button';

interface DemoAccountsProps {
  handleDemoLogin: (email: string) => void;
  isSubmitting: boolean;
}

const DemoAccounts: React.FC<DemoAccountsProps> = ({ handleDemoLogin, isSubmitting }) => {
  return (
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
  );
};

export default DemoAccounts;
