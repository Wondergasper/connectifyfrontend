import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBookings } from '@/hooks/useBookings';
import { ArrowLeft, Calendar, Clock, MapPin, Star, MessageCircle, User, RefreshCw, Filter, Grid, List } from "lucide-react";
import { toast } from "sonner";
import { Booking } from '@/lib/apiTypes';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarView } from '@/components/CalendarView';
import { BookingFilters, FilterOptions } from '@/components/BookingFilters';
import { ReceiptModal } from '@/components/ReceiptModal';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [showReceipt, setShowReceipt] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch bookings from API - dynamically based on user role
  const { data: bookingsData, isLoading, isError } = useBookings({
    type: user?.role === 'customer' ? 'customer' : 'provider'
  });

  const handleViewDetails = (bookingId: string) => {
    navigate(`/booking/${bookingId}`, { state: { role: "customer" } });
  };

  const handleChat = async (providerId: string, bookingId: string) => {
    try {
      // Create or find conversation with provider for this booking
      const conversation = await api.messages.createConversation({
        recipientId: providerId,
        bookingId: bookingId
      });

      // Navigate to messages with conversation ID
      if (conversation?.data?._id) {
        navigate(`/messages?conversation=${conversation.data._id}`);
      } else {
        navigate("/messages");
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('Failed to open chat');
      navigate("/messages");
    }
  };

  const handleBookAgain = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  const handleReview = (bookingId: string) => {
    navigate(`/review/${bookingId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Bookings</h2>
          <p className="text-muted-foreground mb-4">Failed to load your bookings. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Filter bookings based on active tab
  const allBookings = bookingsData?.data || [];

  // Apply filters
  const applyFilters = (bookings: Booking[]) => {
    return bookings.filter(booking => {
      if (filters.dateFrom && new Date(booking.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(booking.date) > new Date(filters.dateTo)) return false;
      if (filters.minAmount && booking.totalAmount < filters.minAmount) return false;
      if (filters.maxAmount && booking.totalAmount > filters.maxAmount) return false;
      if (filters.status && filters.status.length > 0 && !filters.status.includes(booking.status)) return false;
      if (filters.serviceType) {
        const serviceName = typeof booking.service === 'object' ? booking.service.name : '';
        if (!serviceName.toLowerCase().includes(filters.serviceType.toLowerCase())) return false;
      }
      return true;
    });
  };

  const upcomingBookings = applyFilters(allBookings.filter((booking: Booking) =>
    ['pending', 'confirmed', 'in_progress'].includes(booking.status)
  ));
  const completedBookings = applyFilters(allBookings.filter((booking: Booking) =>
    ['completed', 'cancelled', 'rejected'].includes(booking.status)
  ));

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-20 rounded-b-[3rem] relative overflow-hidden shadow-strong">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="mb-2">
          <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-md">My Bookings</h1>
          <p className="text-sm text-white/80">Manage your service appointments</p>
        </div>
      </div>

      {/* Floating Tabs */}
      <div className="px-6 -mt-12 relative z-10 mb-6">
        <div className="bg-card rounded-2xl p-1.5 shadow-strong border border-border flex gap-2">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "upcoming"
              ? "bg-primary text-white shadow-medium"
              : "text-muted-foreground hover:bg-muted"
              }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "completed"
              ? "bg-primary text-white shadow-medium"
              : "text-muted-foreground hover:bg-muted"
              }`}
          >
            Completed ({completedBookings.length})
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div className="px-6 mb-4 flex gap-3">
        <button
          onClick={() => setShowFilters(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${Object.keys(filters).length > 0
            ? 'bg-primary text-white shadow-medium'
            : 'bg-card border-2 border-border text-foreground hover:border-primary/30'
            }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {Object.keys(filters).length > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
              {Object.keys(filters).length}
            </span>
          )}
        </button>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === "list"
              ? 'bg-primary text-white shadow-medium'
              : 'bg-card border-2 border-border text-muted-foreground hover:border-primary/30'
              }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === "calendar"
              ? 'bg-primary text-white shadow-medium'
              : 'bg-card border-2 border-border text-muted-foreground hover:border-primary/30'
              }`}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bookings List or Calendar */}
      {viewMode === "calendar" ? (
        <div className="px-6">
          <CalendarView
            bookings={activeTab === "upcoming" ? upcomingBookings : completedBookings}
            onBookingClick={(booking) => handleViewDetails(booking._id)}
          />
        </div>
      ) : (
        <div className="px-6 space-y-4">
          {activeTab === "upcoming" && upcomingBookings.map((booking: Booking) => (
            <div
              key={booking._id}
              className="bg-card rounded-3xl p-5 shadow-soft border border-border group hover:shadow-medium transition-all duration-300"
            >
              <div className="flex gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft group-hover:scale-105 transition-transform">
                  <User className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{booking.provider.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{booking.service.name}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-600' :
                      booking.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                        booking.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600' :
                          'bg-gray-500/10 text-gray-600'
                      }`}>
                      {booking.status}
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary/70" />
                      <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-border mx-1" />
                      <Clock className="w-4 h-4 text-primary/70" />
                      <span className="font-medium">{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary/70" />
                      {/* @ts-ignore - Booking type definition mismatch with actual usage in component */}
                      <span className="truncate">{booking.address?.address || booking.address?.street || booking.address?.city || 'Location not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-2 border-muted hover:bg-muted/50 font-semibold"
                  onClick={() => handleViewDetails(booking._id)}
                >
                  View Details
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl gradient-primary border-0 font-semibold shadow-sm hover:shadow-md"
                  onClick={() => handleChat(booking.provider._id, booking._id)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          ))}

          {activeTab === "completed" && completedBookings.map((booking: Booking) => (
            <div
              key={booking._id}
              className="bg-card rounded-3xl p-5 shadow-soft border border-border group hover:shadow-medium transition-all duration-300"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                  👤
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{booking.provider.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{booking.service.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">₦{booking.totalAmount}</div>
                    </div>
                  </div>

                  {booking.rating?.value && (
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < booking.rating.value
                            ? "fill-amber-400 text-amber-400"
                            : "fill-border text-border"
                            }`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg inline-block">
                    Completed on {new Date(booking.completedAt || booking.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-2 border-muted hover:bg-muted/50 font-semibold"
                  onClick={() => handleBookAgain(booking.service._id)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Book Again
                </Button>
                {!booking.rating?.value && (
                  <Button
                    variant="outline"
                    className="flex-1 h-11 rounded-xl border-2 border-muted hover:bg-muted/50 font-semibold"
                    onClick={() => handleReview(booking._id)}
                  >
                    Write Review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {viewMode === "list" && activeTab === "upcoming" && upcomingBookings.length === 0 && !isLoading && (
        <div className="px-6 py-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No upcoming bookings</h3>
          <p className="text-muted-foreground mb-8 max-w-[200px] mx-auto">
            You don't have any scheduled services at the moment.
          </p>
          <Button
            onClick={() => navigate("/customer")}
            className="gradient-primary border-0 h-12 px-8 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all"
          >
            Browse Services
          </Button>
        </div>
      )}

      {/* Modals */}
      {showFilters && (
        <BookingFilters
          onApplyFilters={(newFilters) => setFilters(newFilters)}
          onClose={() => setShowFilters(false)}
        />
      )}

      {showReceipt && (
        <ReceiptModal
          booking={showReceipt}
          onClose={() => setShowReceipt(null)}
        />
      )}
    </div>
  );
};

export default Bookings;
