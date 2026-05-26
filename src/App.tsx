import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ConnectionTest } from "@/components/ConnectionTest";
import { RouteProgress } from "./components/RouteProgress";
import { ThemeProvider } from "next-themes";

// Essential pages - direct imports to avoid lazy loading issues
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy load other page components for better performance
const Onboarding = lazy(() => import("./pages/Onboarding"));
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
const LanguageSettings = lazy(() => import("./pages/LanguageSettings"));
const Support = lazy(() => import("./pages/Support"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Receipt = lazy(() => import("./pages/Receipt"));
const WriteReview = lazy(() => import("./pages/WriteReview"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

// Admin Pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const VerificationCenter = lazy(() => import("./pages/admin/VerificationCenter"));
const ServiceManagement = lazy(() => import("./pages/admin/ServiceManagement"));
const ReviewManagement = lazy(() => import("./pages/admin/ReviewManagement"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));
const UserDetail = lazy(() => import("./pages/admin/UserDetail"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

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
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-foreground">Loading…</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Role-based Protected Route - Uses AuthContext
const RoleProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-foreground">Loading…</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their dashboard; admin falls back to customer view
    const redirectPath = user.role === 'admin' ? '/customer' : `/${user.role}`;
    return <Navigate to={redirectPath} replace />;
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
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
        <Route path="/customer-onboarding" element={<ProtectedRoute><CustomerOnboarding /></ProtectedRoute>} />
        <Route path="/provider-onboarding" element={<ProtectedRoute><ProviderOnboarding /></ProtectedRoute>} />

        {/* Protected Routes - Customer */}
        <Route path="/customer" element={<RoleProtectedRoute allowedRoles={['customer', 'admin']}><CustomerDashboard /></RoleProtectedRoute>} />
        <Route path="/bookings" element={<RoleProtectedRoute allowedRoles={['customer', 'admin']}><Bookings /></RoleProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><BookingFlow /></ProtectedRoute>} />
        <Route path="/booking/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
        <Route path="/receipt/:id" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
        <Route path="/review/:id" element={<ProtectedRoute><WriteReview /></ProtectedRoute>} />
        <Route path="/service/:id" element={<ProtectedRoute><ServiceDetail /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/wallet/customer" element={<RoleProtectedRoute allowedRoles={['customer', 'admin']}><CustomerWallet /></RoleProtectedRoute>} />
        <Route path="/profile/customer" element={<RoleProtectedRoute allowedRoles={['customer', 'admin']}><CustomerProfile /></RoleProtectedRoute>} />
        <Route path="/profile/customer/edit" element={<RoleProtectedRoute allowedRoles={['customer', 'admin']}><EditCustomerProfile /></RoleProtectedRoute>} />
        <Route path="/settings/customer" element={<RoleProtectedRoute allowedRoles={['customer', 'admin']}><Settings role="customer" /></RoleProtectedRoute>} />
        <Route path="/settings/language" element={<ProtectedRoute><LanguageSettings /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />

        {/* Protected Routes - Provider */}
        <Route path="/provider" element={<RoleProtectedRoute allowedRoles={['provider', 'admin']}><ProviderDashboard /></RoleProtectedRoute>} />
        <Route path="/manage-bookings" element={<RoleProtectedRoute allowedRoles={['provider', 'admin']}><ManageBookings /></RoleProtectedRoute>} />
        <Route path="/availability" element={<RoleProtectedRoute allowedRoles={['provider', 'admin']}><Availability /></RoleProtectedRoute>} />
        <Route path="/wallet/provider" element={<RoleProtectedRoute allowedRoles={['provider', 'admin']}><ProviderWallet /></RoleProtectedRoute>} />
        <Route path="/profile/provider" element={<RoleProtectedRoute allowedRoles={['provider', 'admin']}><Profile /></RoleProtectedRoute>} />
        <Route path="/profile/edit" element={<RoleProtectedRoute allowedRoles={['provider', 'admin']}><EditProfile /></RoleProtectedRoute>} />
        <Route path="/settings/provider" element={<RoleProtectedRoute allowedRoles={['provider', 'admin']}><Settings role="provider" /></RoleProtectedRoute>} />

        {/* Wallet Routes */}
        <Route path="/wallet/add-funds" element={<ProtectedRoute><AddFunds /></ProtectedRoute>} />
        <Route path="/wallet/verify" element={<ProtectedRoute><AddFunds /></ProtectedRoute>} />
        <Route path="/wallet/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
        <Route path="/wallet/cards" element={<ProtectedRoute><ManageCards /></ProtectedRoute>} />
        <Route path="/wallet/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminLayout /></RoleProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="verification" element={<VerificationCenter />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="settings" element={<Settings role="admin" />} />
        </Route>

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
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <RouteProgress />
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
