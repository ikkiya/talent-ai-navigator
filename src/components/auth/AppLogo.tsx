
import React from 'react';
import { Sparkles } from 'lucide-react';

const AppLogo: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="h-8 w-8 text-brand-blue" />
        <h1 className="text-3xl font-bold">TalentNavigator</h1>
      </div>
      <p className="text-muted-foreground">AI-Powered Employee & Team Management</p>
    </div>
  );
};

export default AppLogo;
