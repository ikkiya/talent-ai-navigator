
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Admin pages
import Users from "./pages/admin/Users";
import TalentPool from "./pages/admin/TalentPool";
import Reports from "./pages/admin/Reports";

// Manager pages
import Employees from "./pages/manager/Employees";
import Projects from "./pages/manager/Projects";
import Matrices from "./pages/manager/Matrices";

// Mentor pages
import Recommendations from "./pages/mentor/Recommendations";
import Mentees from "./pages/mentor/Mentees";

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRoles = ["admin", "manager", "mentor"] 
}: { 
  children: React.ReactNode;
  requiredRoles?: Array<"admin" | "manager" | "mentor">; 
}) => {
  const { auth, isAuthorized } = useAuth();
  
  if (auth.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAuthorized(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/talent-pool" element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <TalentPool />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/reports" element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            } />
            
            {/* Manager routes */}
            <Route path="/manager/employees" element={
              <ProtectedRoute requiredRoles={["admin", "manager"]}>
                <Employees />
              </ProtectedRoute>
            } />
            
            <Route path="/manager/projects" element={
              <ProtectedRoute requiredRoles={["admin", "manager"]}>
                <Projects />
              </ProtectedRoute>
            } />
            
            <Route path="/manager/matrices" element={
              <ProtectedRoute requiredRoles={["admin", "manager"]}>
                <Matrices />
              </ProtectedRoute>
            } />
            
            {/* Mentor routes */}
            <Route path="/mentor/recommendations" element={
              <ProtectedRoute requiredRoles={["admin", "mentor"]}>
                <Recommendations />
              </ProtectedRoute>
            } />
            
            <Route path="/mentor/mentees" element={
              <ProtectedRoute requiredRoles={["admin", "mentor"]}>
                <Mentees />
              </ProtectedRoute>
            } />
            
            {/* Error routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
