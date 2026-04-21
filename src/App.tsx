import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppModeProvider } from "@/contexts/AppModeContext";
import Index from "./pages/Index";
import SoundDetail from "./pages/SoundDetail";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import InstallBanner from "@/components/InstallBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppModeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <InstallBanner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sound/:soundId" element={<SoundDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
