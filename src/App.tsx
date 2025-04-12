
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import Quotes from "./pages/Quotes";
import Responses from "./pages/Responses";
import Jobs from "./pages/Jobs";
import Schedule from "./pages/Schedule";
import Crews from "./pages/Crews";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRoute from "./components/AuthRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<AuthRoute><Index /></AuthRoute>} />
            <Route path="/leads" element={<AuthRoute><Leads /></AuthRoute>} />
            <Route path="/quotes" element={<AuthRoute><Quotes /></AuthRoute>} />
            <Route path="/responses" element={<AuthRoute><Responses /></AuthRoute>} />
            <Route path="/jobs" element={<AuthRoute><Jobs /></AuthRoute>} />
            <Route path="/schedule" element={<AuthRoute><Schedule /></AuthRoute>} />
            <Route path="/crews" element={<AuthRoute><Crews /></AuthRoute>} />
            <Route path="/reports" element={<AuthRoute><Reports /></AuthRoute>} />
            <Route path="/settings" element={<AuthRoute><Settings /></AuthRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
