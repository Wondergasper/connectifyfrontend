import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Star, MapPin, Clock, Home, User, CalendarCheck, Wallet, Settings, MessageSquare, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBookings } from "@/hooks/useBookings";
import { useWalletBalance } from "@/hooks/useWallet";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useProfile } from "@/hooks/useAuth";

const ProviderDashboard = () => {
  const navigate = useNavigate();

  // Fetch provider profile data to get name and other details
  const { data: profileData, isLoading: profileLoading } = useProfile();

  // Fetch provider stats and data from API
  const { data: bookingsData, isLoading: bookingsLoading } = useBookings({ type: 'provider' });
  const { data: walletBalance, isLoading: balanceLoading } = useWalletBalance();

  // Fetch provider's reviews to calculate rating
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', 'provider', profileData?.data?.user?._id],
    queryFn: () => api.reviews.getByProvider(profileData?.data?.user?._id || ''),
    enabled: !!profileData?.data?.user?._id
  });

  // Fetch upcoming jobs (bookings with status 'pending' or 'confirmed')
  const allBookings = bookingsData?.data || [];
  const upcomingJobs = allBookings.filter((booking: { status: string }) =>
    ['pending', 'confirmed'].includes(booking.status)
  ).slice(0, 2);

  // Calculate stats from bookings and wallet data
  const earnings = walletBalance?.balance || 0;

  const totalJobs = allBookings.length;
  const jobsDone = allBookings.filter((booking: { status: string }) =>
    ['completed', 'done'].includes(booking.status)
  ).length;

  // Calculate average rating from reviews
  const reviews = reviewsData?.data || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const reviewCount = reviews.length;

  const stats = [
    { label: "Earnings", value: `₦${earnings.toLocaleString()}`, icon: TrendingUp, change: "" }, // Would require historical data to calculate change
    { label: "Jobs Done", value: jobsDone.toString(), icon: Calendar, change: "" }, // Would require historical data to calculate change
    { label: "Rating", value: averageRating, icon: Star, change: `${reviewCount} reviews` },
  ];

  const handleAccept = (id: string) => {
    navigate(`/booking/${id}`, { state: { role: "provider" } });
  };

  const handleReschedule = (id: string) => {
    navigate(`/booking/${id}`, { state: { role: "provider" } });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-6 rounded-b-3xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-md">
              Welcome back, {profileData?.data?.user?.name?.split(' ')[0] || 'Provider'}!
            </h1>
            <p className="text-sm text-white/80 mt-1">Track your business growth</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-full backdrop-blur-sm border ${profileData?.data?.user?.isActive ? 'bg-green-500/20 border-green-500/30 text-green-200' : 'bg-amber-500/20 border-amber-500/30 text-amber-200'
              }`}>
              <span className="text-xs font-medium">
                ● {profileData?.data?.user?.isActive ? 'Online' : 'Offline'}
              </span>
            </div>
            <button
              onClick={() => navigate("/messages")}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-medium hover:bg-white/30 transition-smooth relative"
            >
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-medium hover:bg-white/30 transition-smooth relative"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <button
              onClick={() => navigate("/profile/provider")}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-medium hover:bg-white/30 transition-smooth"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Summary</h2>
        <div className="grid grid-cols-3 gap-3">
          {balanceLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 shadow-soft border border-border animate-pulse"
              >
                <div className="w-5 h-5 bg-muted rounded mb-2"></div>
                <div className="space-y-1">
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-2xl p-4 shadow-soft border border-border"
              >
                <div className="flex flex-col gap-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {stat.label}
                    </div>
                    <div className="text-xs text-accent font-medium mt-1">
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/manage-bookings")}
            className="bg-card rounded-2xl p-4 text-left hover:shadow-medium transition-smooth border border-border"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3 shadow-soft">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-semibold text-foreground">Manage Bookings</div>
            <div className="text-xs text-muted-foreground mt-1">View & update</div>
          </button>
          <button
            onClick={() => navigate("/availability")}
            className="bg-card rounded-2xl p-4 text-left hover:shadow-medium transition-smooth border border-border"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3 shadow-soft">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-semibold text-foreground">Availability</div>
            <div className="text-xs text-muted-foreground mt-1">Set schedule</div>
          </button>
          <button
            onClick={() => navigate("/wallet/provider")}
            className="bg-card rounded-2xl p-4 text-left hover:shadow-medium transition-smooth border border-border"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3 shadow-soft">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-semibold text-foreground">Wallet</div>
            <div className="text-xs text-muted-foreground mt-1">
              ₦{walletBalance?.balance?.toLocaleString() || '0'}
            </div>
          </button>
          <button
            onClick={() => navigate("/profile/provider")}
            className="bg-card rounded-2xl p-4 text-left hover:shadow-medium transition-smooth border border-border"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3 shadow-soft">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-semibold text-foreground">Profile</div>
            <div className="text-xs text-muted-foreground mt-1">Edit details</div>
          </button>
        </div>
      </div>

      {/* Upcoming Jobs */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Upcoming Jobs</h2>
          <button
            onClick={() => navigate("/manage-bookings")}
            className="text-sm text-primary font-medium"
          >
            See all
          </button>
        </div>

        <div className="space-y-3">
          {bookingsLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="w-full bg-card rounded-2xl p-4 shadow-soft border border-border animate-pulse"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4 text-xs">
                  <div className="h-3 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-9 bg-muted rounded"></div>
                  <div className="flex-1 h-9 bg-muted rounded"></div>
                </div>
              </div>
            ))
          ) : upcomingJobs.length > 0 ? (
            upcomingJobs.map((booking) => (
              <div
                key={booking._id}
                className="bg-card rounded-2xl p-4 shadow-soft border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{booking.customer?.name || 'Customer'}</h3>
                    <p className="text-sm text-muted-foreground">{booking.service?.name || booking.serviceName || 'Service'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">₦{(booking.totalAmount || 0).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{booking.address?.location || booking.address?.street || 'Location not specified'}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1 h-9 gradient-primary border-0 text-sm"
                    onClick={() => handleAccept(booking._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-9 text-sm"
                    onClick={() => handleReschedule(booking._id)}
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-card rounded-2xl border border-border">
              <p className="text-muted-foreground">No upcoming jobs at the moment</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => navigate("/manage-bookings")}
              >
                View All Bookings
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card/80 backdrop-blur-lg border-t border-border px-6 py-4">
        <div className="flex items-center justify-around">
          <button
            onClick={() => navigate("/provider")}
            className="flex flex-col items-center gap-1 text-primary"
          >
            <Home className="w-6 h-6" fill="currentColor" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => navigate("/manage-bookings")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Jobs</span>
          </button>
          <button
            onClick={() => navigate("/wallet/provider")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs font-medium">Wallet</span>
          </button>
          <button
            onClick={() => navigate("/settings/provider")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
