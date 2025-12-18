import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Star,
  Clock,
  TrendingUp,
  Home,
  Wrench,
  Sparkles,
  Zap,
  BookOpen,
  Scissors,
  Hammer,
  Wallet,
  Settings,
  Calendar,
  Shield,
  User,
  MessageSquare,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useServices";
import { useSearchServices } from "@/hooks/useServices";
import { useProfile } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { useWalletBalance } from "@/hooks/useWallet";
import { toast } from "sonner";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  // Fetch user profile to get name and location
  const { data: profileData, isLoading: profileLoading } = useProfile();

  // Fetch categories and featured services/providers from API
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  // Use user's location if available, otherwise default to Lagos
  const userLocation = profileData?.data?.user?.profile?.location?.address || "Lagos";

  const { data: providersData, isLoading: providersLoading } = useSearchServices({
    location: userLocation,
    category: ""
  });

  // Fetch user's bookings and wallet data
  const { data: bookingsData, isLoading: bookingsLoading } = useBookings({
    type: 'customer',
    status: ''
  });
  const { data: walletBalance, isLoading: balanceLoading } = useWalletBalance();

  // Map icons to category names
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, typeof Wrench> = {
      'Plumbing': Wrench,
      'Cleaning': Sparkles,
      'Electrical': Zap,
      'Tutoring': BookOpen,
      'Beauty': Scissors,
      'Repair': Hammer,
    };
    return iconMap[categoryName] || Wrench; // Default to Wrench if not found
  };

  // Calculate stats from API data
  const allBookings = bookingsData?.data || [];
  const totalBookings = allBookings.length;
  const completedBookings = allBookings.filter((booking: { status: string }) =>
    ['completed', 'done'].includes(booking.status)
  ).length;

  // Calculate average rating from completed bookings
  const completedRatings = allBookings
    .filter((booking: { status: string }) => ['completed', 'done'].includes(booking.status))
    .map((booking: { rating?: { value: number } }) => booking.rating?.value)
    .filter((rating: number | undefined): rating is number => rating !== undefined);

  const averageRating = completedRatings.length > 0
    ? (completedRatings.reduce((sum: number, rating: number) => sum + rating, 0) / completedRatings.length).toFixed(1)
    : '0.0';

  // Filter featured providers from the services data
  const featuredProviders = providersData?.data?.slice(0, 3) || [];
  const categories = categoriesData?.data || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-8 rounded-b-[2rem] shadow-strong">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Hi, {profileData?.data?.user?.name || 'there'} 👋
            </h1>
            <p className="text-sm text-white/80 mt-1">What do you need today?</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/messages")}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-medium hover:bg-white/30 transition-smooth relative"
            >
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-medium hover:bg-white/30 transition-smooth relative"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <button
              onClick={() => navigate("/profile/customer")}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-medium hover:bg-white/30 transition-smooth"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <button
          onClick={() => navigate("/search")}
          className="relative w-full text-left group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for services..."
            className="pl-12 h-14 bg-white border-0 shadow-medium focus:ring-2 focus:ring-primary/20 group-hover:shadow-strong transition-smooth"
            readOnly
          />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-6 mb-6">
        <div className="bg-card rounded-2xl shadow-medium border border-border p-4">
          <div className="grid grid-cols-3 gap-4">
            {bookingsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="text-center animate-pulse"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted/50 mx-auto mb-2" />
                  <div className="h-6 bg-muted rounded w-6 mx-auto mb-1" />
                  <div className="h-3 bg-muted rounded w-8 mx-auto" />
                </div>
              ))
            ) : (
              <>
                <button
                  onClick={() => navigate("/bookings")}
                  className="text-center hover:scale-105 transition-smooth"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{totalBookings}</div>
                  <div className="text-xs text-muted-foreground">Bookings</div>
                </button>
                <div className="text-center border-x border-border">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{averageRating}</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                {balanceLoading ? (
                  <div className="text-center animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 mx-auto mb-2" />
                    <div className="h-6 bg-muted rounded w-8 mx-auto mb-1" />
                    <div className="h-3 bg-muted rounded w-10 mx-auto" />
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/wallet/customer")}
                    className="text-center hover:scale-105 transition-smooth"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Wallet className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-xl font-bold text-foreground">₦{walletBalance?.balance?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-muted-foreground">Balance</div>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Categories</h2>
        <div className="grid grid-cols-3 gap-3">
          {categoriesLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 text-center border border-border animate-pulse"
              >
                <div className="w-12 h-12 rounded-xl bg-muted mx-auto mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
              </div>
            ))
          ) : (
            categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              return (
                <button
                  key={category._id || category.name}
                  onClick={() => navigate(`/search?category=${category.name}`)}
                  className="bg-card rounded-2xl p-5 text-center hover:shadow-medium transition-smooth border border-border hover:border-primary/20 group"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3 shadow-soft group-hover:shadow-medium transition-smooth">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-medium text-foreground">{category.name}</div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Featured Providers */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Featured Near You</h2>
          <button
            onClick={() => navigate("/search")}
            className="text-sm text-primary font-medium"
          >
            See all
          </button>
        </div>

        <div className="space-y-4">
          {providersLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-full bg-card rounded-2xl p-5 shadow-soft border border-border animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                    <div className="h-8 bg-muted rounded w-1/4 mt-2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            featuredProviders.length > 0 ? (
              featuredProviders.map((service) => (
                <div
                  key={service._id}
                  onClick={() => navigate(`/service/${service._id}`)}
                  className="w-full bg-card rounded-2xl p-5 shadow-soft border border-border hover:shadow-strong hover:border-primary/20 transition-smooth text-left group cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-medium flex-shrink-0 group-hover:shadow-strong transition-smooth">
                      <User className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground text-base">{service.provider?.name || service.name}</h3>
                            {service.provider?.profile?.verification?.verified && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-soft">
                                <Shield className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{service.name || service.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                          <span className="font-semibold text-foreground">{service.averageRating || 0}</span>
                          <span>({service.reviewCount || 0})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{service.location?.address || userLocation}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">₦{(service.price || 0).toLocaleString()}/{service.priceType === 'hourly' ? 'hr' : 'fixed'}</span>
                        <Button
                          size="sm"
                          className="h-9 px-5 shadow-soft group-hover:shadow-medium transition-smooth"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/service/${service._id}`);
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No services found near you yet. Try adjusting your search.</p>
                <Button
                  className="mt-4"
                  onClick={() => navigate("/search")}
                >
                  Browse All Services
                </Button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4 shadow-strong backdrop-blur-lg bg-card/95">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => navigate("/customer")}
            className="flex flex-col items-center gap-1.5 text-primary group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => navigate("/bookings")}
            className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-muted transition-smooth">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Bookings</span>
          </button>
          <button
            onClick={() => navigate("/wallet/customer")}
            className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-muted transition-smooth">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Wallet</span>
          </button>
          <button
            onClick={() => navigate("/settings/customer")}
            className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-muted transition-smooth">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div >
  );
};

export default CustomerDashboard;
