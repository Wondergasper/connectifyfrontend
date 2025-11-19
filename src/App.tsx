import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-foreground">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/role" element={<RoleSelection />} />
            <Route path="/customer-onboarding" element={<CustomerOnboarding />} />
            <Route path="/provider-onboarding" element={<ProviderOnboarding />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/booking" element={<BookingFlow />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/manage-bookings" element={<ManageBookings />} />
            <Route path="/booking/:id" element={<BookingDetail />} />
            <Route path="/receipt/:id" element={<Receipt />} />
            <Route path="/review/:id" element={<WriteReview />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            {/* Wallet Routes */}
            <Route path="/wallet/provider" element={<ProviderWallet />} />
            <Route path="/wallet/customer" element={<CustomerWallet />} />
            <Route path="/wallet/add-funds" element={<AddFunds />} />
            <Route path="/wallet/withdraw" element={<Withdraw />} />
            <Route path="/wallet/cards" element={<ManageCards />} />
            <Route path="/wallet/transactions" element={<Transactions />} />
            {/* Profile Routes */}
            <Route path="/profile/provider" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/customer" element={<CustomerProfile />} />
            <Route path="/profile/customer/edit" element={<EditCustomerProfile />} />
            {/* Settings */}
            <Route path="/settings/customer" element={<Settings role="customer" />} />
            <Route path="/settings/provider" element={<Settings role="provider" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
