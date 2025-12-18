import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, MessageSquare, User, Star, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useBookings } from "@/hooks/useBookings";
import { Booking } from '@/lib/apiTypes';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { CalendarView } from '@/components/CalendarView';
import { BookingFilters, FilterOptions } from '@/components/BookingFilters';
import { BulkActions, BookingCheckbox } from '@/components/BulkActions';
import { ReceiptModal } from '@/components/ReceiptModal';

const ManageBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [showReceipt, setShowReceipt] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const { user } = useAuth();
  const { data: bookingsData, isLoading } = useBookings({
    type: user?.role === 'provider' ? 'provider' : 'customer'
  });

  const allBookings = bookingsData?.data || [];

  // Filter bookings based on status for tabs
  const upcomingBookings = allBookings.filter((booking: Booking) =>
    ['pending', 'confirmed', 'in_progress'].includes(booking.status)
  );

  const historyBookings = allBookings.filter((booking: Booking) =>
    ['completed', 'cancelled', 'rejected'].includes(booking.status)
  );

  const handleChat = async (customerId: string, bookingId: string) => {
    try {
      const conversation = await api.messages.createConversation({
        recipientId: customerId,
        bookingId: bookingId
      });
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

  const handleViewDetails = (bookingId: string) => {
    navigate(`/booking/${bookingId}`, { state: { role: "provider" } });
  };

  const handleViewReceipt = (bookingId: string) => {
    navigate(`/receipt/${bookingId}`);
  };

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
          <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-md">Manage Bookings</h1>
          <p className="text-sm text-white/80">Track your service appointments</p>
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
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "history"
              ? "bg-primary text-white shadow-medium"
              : "text-muted-foreground hover:bg-muted"
              }`}
          >
            History ({historyBookings.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-4">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-3xl p-5 shadow-soft border border-border animate-pulse"
            >
              <div className="flex gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-muted flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-11 rounded-xl bg-muted"></div>
                <div className="flex-1 h-11 rounded-xl bg-muted"></div>
              </div>
            </div>
          ))
        ) : (
          <>
            {activeTab === "upcoming" && upcomingBookings.map((booking) => (
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
                        <h3 className="font-bold text-foreground text-lg">{booking.customer?.name || booking.customerName || 'Customer'}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{booking.service?.name || booking.serviceName || 'Service'}</p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${booking.status === "confirmed" || booking.status === "completed"
                        ? "bg-green-500/10 text-green-600"
                        : booking.status === "pending"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-muted text-muted-foreground"
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
                        <span className="truncate">{booking.address?.location || booking.address?.street || 'Address not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 text-primary/70" />
                        <span className="font-medium">{booking.customer?.phone || 'Phone not available'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 rounded-xl border-2 border-muted hover:bg-muted/50 font-semibold"
                    onClick={() => handleChat(booking.customer?._id || '', booking._id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    className="flex-1 h-11 rounded-xl gradient-primary border-0 font-semibold shadow-sm hover:shadow-md"
                    onClick={() => handleViewDetails(booking._id)}
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}

            {activeTab === "history" && historyBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-card rounded-3xl p-5 shadow-soft border border-border group hover:shadow-medium transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    <User className="w-7 h-7 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{booking.customer?.name || booking.customerName || 'Customer'}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{booking.service?.name || booking.serviceName || 'Service'}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">₦{(booking.totalAmount || 0).toLocaleString()}</div>
                      </div>
                    </div>

                    {booking.averageRating !== undefined && (
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < booking.averageRating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-border text-border"
                              }`}
                          />
                        ))}
                      </div>
                    )}

                    <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg inline-block">
                      Completed on {new Date(booking.updatedAt || booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border/50">
                  <Button
                    variant="ghost"
                    className="w-full h-11 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                    onClick={() => handleViewReceipt(booking._id)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Receipt
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
