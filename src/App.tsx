
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

// Initialize demo users
const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem("barUsers");
  if (!existingUsers) {
    const demoUsers = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@bar.com",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Employee User",
        email: "employee@bar.com",
        password: "emp123",
        role: "employee",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("barUsers", JSON.stringify(demoUsers));
  }
};

// Initialize demo users on app start
initializeDemoUsers();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/" 
            element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AuthGuard requiredRoles={['admin', 'manager']}>
                <Admin />
              </AuthGuard>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
