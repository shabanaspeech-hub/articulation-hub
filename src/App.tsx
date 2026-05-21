import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppModeProvider } from "@/contexts/AppModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGate from "@/components/AuthGate";
import AdminLoginModal from "@/components/AdminLoginModal";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import SoundDetail from "./pages/SoundDetail";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import InstallBanner from "@/components/InstallBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppModeProvider>
            <Toaster />
            <Sonner />
            <InstallBanner />
            <AdminLoginModal />
            <Routes>
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/" element={<AuthGate><Index /></AuthGate>} />
              <Route path="/sound/:soundId" element={<AuthGate><SoundDetail /></AuthGate>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
