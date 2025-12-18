import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ConnectionTest } from "@/components/ConnectionTest";

// Lazy load page components for better performance
const Index = lazy(() => import("./pages/Index"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Auth = lazy(() => import("./pages/Auth"));
const RoleSelection = lazy(() => import("./pages/RoleSelection"));
const CustomerOnboarding = lazy(() => import("./pages/CustomerOnboarding"));
const ProviderOnboarding = lazy(() => import("./pages/ProviderOnboarding"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const ProviderDashboard = lazy(() => import("./pages/ProviderDashboard"));
const BookingFlow = lazy(() => import("./pages/BookingFlow"));
const Bookings = lazy(() => import("./pages/Bookings"));
const ManageBookings = lazy(() => import("./pages/ManageBookings"));
const BookingDetail = lazy(() => import("./pages/BookingDetail"));
const Availability = lazy(() => import("./pages/Availability"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Messages = lazy(() => import("./pages/Messages"));
const ProviderWallet = lazy(() => import("./pages/ProviderWallet"));
const CustomerWallet = lazy(() => import("./pages/CustomerWallet"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const CustomerProfile = lazy(() => import("./pages/CustomerProfile"));
const EditCustomerProfile = lazy(() => import("./pages/EditCustomerProfile"));
const AddFunds = lazy(() => import("./pages/AddFunds"));
const Withdraw = lazy(() => import("./pages/Withdraw"));
const ManageCards = lazy(() => import("./pages/ManageCards"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Receipt = lazy(() => import("./pages/Receipt"));
const WriteReview = lazy(() => import("./pages/WriteReview"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component - Uses AuthContext instead of calling useProfile again
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-foreground">Loading…</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Role-based Protected Route - Uses AuthContext
const RoleProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-foreground">Loading…</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
};

// App routes component - Uses AuthContext
const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-foreground">Loading…</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
        <Route path="/customer-onboarding" element={<ProtectedRoute><CustomerOnboarding /></ProtectedRoute>} />
        <Route path="/provider-onboarding" element={<ProtectedRoute><ProviderOnboarding /></ProtectedRoute>} />

        {/* Protected Routes - Customer */}
        <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><BookingFlow /></ProtectedRoute>} />
        <Route path="/booking/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
        <Route path="/receipt/:id" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
        <Route path="/review/:id" element={<ProtectedRoute><WriteReview /></ProtectedRoute>} />
        <Route path="/service/:id" element={<ProtectedRoute><ServiceDetail /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/wallet/customer" element={<ProtectedRoute><CustomerWallet /></ProtectedRoute>} />
        <Route path="/profile/customer" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
        <Route path="/profile/customer/edit" element={<ProtectedRoute><EditCustomerProfile /></ProtectedRoute>} />
        <Route path="/settings/customer" element={<ProtectedRoute><Settings role="customer" /></ProtectedRoute>} />

        {/* Protected Routes - Provider */}
        <Route path="/provider" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/manage-bookings" element={<ProtectedRoute><ManageBookings /></ProtectedRoute>} />
        <Route path="/availability" element={<ProtectedRoute><Availability /></ProtectedRoute>} />
        <Route path="/wallet/provider" element={<ProtectedRoute><ProviderWallet /></ProtectedRoute>} />
        <Route path="/profile/provider" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/settings/provider" element={<ProtectedRoute><Settings role="provider" /></ProtectedRoute>} />

        {/* Wallet Routes */}
        <Route path="/wallet/add-funds" element={<ProtectedRoute><AddFunds /></ProtectedRoute>} />
        <Route path="/wallet/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
        <Route path="/wallet/cards" element={<ProtectedRoute><ManageCards /></ProtectedRoute>} />
        <Route path="/wallet/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />

        {/* Global Routes */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-foreground">Loading...</div>}>
                <AppRoutes />
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;