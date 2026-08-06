import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppModeProvider } from "@/contexts/AppModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SoundDetail from "./pages/SoundDetail";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import InstallBanner from "@/components/InstallBanner";
import { useEffect } from "react";
import { playStartupSound } from "@/lib/startupSound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    playStartupSound();
  }, []);

  return (

  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppModeProvider>
            <Toaster />
            <Sonner />
            <InstallBanner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sound/:soundId" element={<SoundDetail />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};


export default App;
