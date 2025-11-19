import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Star, MessageCircle, User, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const navigate = useNavigate();

  const handleViewDetails = (bookingId: number) => {
    navigate(`/booking/${bookingId}`, { state: { role: "customer" } });
  };

  const handleChat = (providerName: string) => {
    navigate("/messages");
  };

  const handleBookAgain = (providerName: string) => {
    navigate("/booking");
  };

  const handleReview = (bookingId: number) => {
    navigate(`/review/${bookingId}`);
  };

  const upcomingBookings = [
    {
      id: 1,
      provider: "Chioma Nwosu",
      service: "House Cleaning",
      date: "Today",
      time: "2:00 PM",
      location: "Lekki Phase 1",
      price: "₦8,000",
      status: "confirmed",
      image: "👩🏾",
    },
    {
      id: 2,
      provider: "Ibrahim Musa",
      service: "Plumbing Repair",
      date: "Tomorrow",
      time: "10:00 AM",
      location: "Victoria Island",
      price: "₦12,000",
      status: "pending",
      image: "👨🏾",
    },
  ];

  const completedBookings = [
    {
      id: 3,
      provider: "Blessing Okafor",
      service: "Math Tutoring",
      date: "Dec 10, 2024",
      time: "4:00 PM",
      location: "Ikoyi",
      price: "₦5,000",
      rating: 5,
      image: "👩🏾‍🏫",
    },
    {
      id: 4,
      provider: "Chioma Nwosu",
      service: "Office Cleaning",
      date: "Dec 8, 2024",
      time: "9:00 AM",
      location: "Lekki Phase 1",
      price: "₦15,000",
      rating: 5,
      image: "👩🏾",
    },
  ];

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

      {/* Bookings List */}
      <div className="px-6 space-y-4">
        {activeTab === "upcoming" && upcomingBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-card rounded-3xl p-5 shadow-soft border border-border group hover:shadow-medium transition-all duration-300"
          >
            <div className="flex gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft group-hover:scale-105 transition-transform">
                <User className="w-7 h-7 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{booking.provider}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{booking.service}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${booking.status === "confirmed"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-amber-500/10 text-amber-600"
                    }`}>
                    {booking.status}
                  </div>
                </div>

                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    <span className="font-medium">{booking.date}</span>
                    <span className="w-1 h-1 rounded-full bg-border mx-1" />
                    <Clock className="w-4 h-4 text-primary/70" />
                    <span className="font-medium">{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary/70" />
                    <span className="truncate">{booking.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-2 border-muted hover:bg-muted/50 font-semibold"
                onClick={() => handleViewDetails(booking.id)}
              >
                View Details
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl gradient-primary border-0 font-semibold shadow-sm hover:shadow-md"
                onClick={() => handleChat(booking.provider)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
        ))}

        {activeTab === "completed" && completedBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-card rounded-3xl p-5 shadow-soft border border-border group hover:shadow-medium transition-all duration-300"
          >
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                {booking.image}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{booking.provider}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{booking.service}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{booking.price}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < booking.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-border text-border"
                        }`}
                    />
                  ))}
                </div>

                <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg inline-block">
                  Completed on {booking.date}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-2 border-muted hover:bg-muted/50 font-semibold"
                onClick={() => handleBookAgain(booking.provider)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Book Again
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-2 border-muted hover:bg-muted/50 font-semibold"
                onClick={() => handleReview(booking.id)}
              >
                Write Review
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activeTab === "upcoming" && upcomingBookings.length === 0 && (
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
    </div>
  );
};

export default Bookings;
