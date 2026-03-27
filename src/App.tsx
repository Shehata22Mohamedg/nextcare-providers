import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();
const GA_MEASUREMENT_ID = "G-SSN9LNR9D1";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (!gtag) return;

    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
      send_to: GA_MEASUREMENT_ID,
    });
  }, [location]);

  return null;
}

function AppInner() {
  const { dir } = useLanguage();

  return (
    <div dir={dir}>
      <TooltipProvider>
        <Toaster />
        <Sonner />        
        <BrowserRouter
          basename="/nextcare-providers"
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AnalyticsTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </div>
  );
}


const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
