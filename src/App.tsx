
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

// Manager pages
import Matrices from "./pages/manager/Matrices";

// Mentor pages
import Recommendations from "./pages/mentor/Recommendations";

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
            
            {/* Manager routes */}
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
            
            {/* Error routes */}
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
