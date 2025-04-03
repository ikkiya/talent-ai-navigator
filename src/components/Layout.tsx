import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, Users, User, FileSpreadsheet, 
  Settings, LogOut, BriefcaseBusiness, UserCog, 
  BarChart, Sparkles, BarChart2, FileChart
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children, end }) => {
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
  
  return (
    <Link 
      to={to} 
      className={cn('nav-link', isActive && 'active')}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth, logout, isAuthorized } = useAuth();
  const navigate = useNavigate();
  
  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (auth.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!auth.isAuthenticated || !auth.user) {
    return children;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 hidden md:flex flex-col h-full border-r bg-sidebar text-sidebar-foreground">
        <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-brand-blue" />
          <h1 className="text-xl font-bold">TalentNavigator</h1>
        </div>
        
        <div className="py-4 flex-1 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {/* Common links for all users */}
            <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} end>
              Dashboard
            </SidebarLink>
            
            {/* Admin links */}
            {isAuthorized(['admin']) && (
              <>
                <div className="pt-5 pb-2 px-3 text-xs font-semibold text-muted-foreground">
                  Admin
                </div>
                <SidebarLink to="/admin/users" icon={<Users className="h-5 w-5" />}>
                  Users
                </SidebarLink>
                <SidebarLink to="/admin/talent-pool" icon={<FileSpreadsheet className="h-5 w-5" />}>
                  Talent Pool
                </SidebarLink>
                <SidebarLink to="/admin/reports" icon={<BarChart className="h-5 w-5" />}>
                  Reports
                </SidebarLink>
              </>
            )}
            
            {/* Manager links */}
            {isAuthorized(['admin', 'manager']) && (
              <>
                <div className="pt-5 pb-2 px-3 text-xs font-semibold text-muted-foreground">
                  Management
                </div>
                <SidebarLink to="/manager/employees" icon={<Users className="h-5 w-5" />}>
                  Employees
                </SidebarLink>
                <SidebarLink to="/manager/projects" icon={<BriefcaseBusiness className="h-5 w-5" />}>
                  Projects
                </SidebarLink>
                <SidebarLink to="/manager/matrices" icon={<FileChart className="h-5 w-5" />}>
                  Matrices
                </SidebarLink>
              </>
            )}
            
            {/* Mentor links */}
            {isAuthorized(['admin', 'mentor']) && (
              <>
                <div className="pt-5 pb-2 px-3 text-xs font-semibold text-muted-foreground">
                  Mentoring
                </div>
                <SidebarLink to="/mentor/mentees" icon={<UserCog className="h-5 w-5" />}>
                  Mentees
                </SidebarLink>
                <SidebarLink to="/mentor/recommendations" icon={<Sparkles className="h-5 w-5" />}>
                  AI Recommendations
                </SidebarLink>
              </>
            )}
            
            <div className="pt-5 pb-2 px-3 text-xs font-semibold text-muted-foreground">
              Settings
            </div>
            <SidebarLink to="/profile" icon={<User className="h-5 w-5" />}>
              Profile
            </SidebarLink>
            <SidebarLink to="/settings" icon={<Settings className="h-5 w-5" />}>
              Settings
            </SidebarLink>
          </nav>
        </div>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={auth.user.avatarUrl} />
                <AvatarFallback>{auth.user.firstName[0]}{auth.user.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{auth.user.firstName} {auth.user.lastName}</p>
                <p className="text-xs text-muted-foreground capitalize">{auth.user.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 flex justify-around py-2">
        <Link to="/dashboard" className="p-2">
          <LayoutDashboard className="h-6 w-6" />
        </Link>
        {isAuthorized(['admin']) && (
          <Link to="/admin/users" className="p-2">
            <Users className="h-6 w-6" />
          </Link>
        )}
        {isAuthorized(['admin', 'manager']) && (
          <Link to="/manager/projects" className="p-2">
            <BriefcaseBusiness className="h-6 w-6" />
          </Link>
        )}
        {isAuthorized(['admin', 'mentor']) && (
          <Link to="/mentor/mentees" className="p-2">
            <UserCog className="h-6 w-6" />
          </Link>
        )}
        <Link to="/profile" className="p-2">
          <User className="h-6 w-6" />
        </Link>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">
              {/* Page title would go here, but we'll keep it simple for now */}
              TalentNavigator
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleLogout} className="md:hidden">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
