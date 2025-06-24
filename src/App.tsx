
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import LowStock from "./pages/LowStock";
import PotentialRevenue from "./pages/PotentialRevenue";
import StockSheet from "./pages/StockSheet";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

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
          <Route 
            path="/stock-sheet" 
            element={
              <AuthGuard>
                <StockSheet />
              </AuthGuard>
            } 
          />
          <Route 
            path="/low-stock" 
            element={
              <AuthGuard>
                <LowStock />
              </AuthGuard>
            } 
          />
          <Route 
            path="/potential-revenue" 
            element={
              <AuthGuard>
                <PotentialRevenue />
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
