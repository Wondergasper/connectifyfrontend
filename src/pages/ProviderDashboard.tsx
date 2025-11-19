import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Star, MapPin, Clock, Home, User, CalendarCheck, Wallet, Settings, MessageSquare, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const stats = [
  { label: "Earnings", value: "₦234,500", icon: TrendingUp, change: "+12%" },
  { label: "Jobs Done", value: "47", icon: Calendar, change: "+8" },
  { label: "Rating", value: "4.9", icon: Star, change: "127 reviews" },
];

const upcomingJobs = [
  {
    id: 1,
    customer: "Adebayo Williams",
    service: "House Cleaning",
    time: "Today, 2:00 PM",
    location: "Lekki Phase 1",
    price: "₦15,000",
  },
  {
    id: 2,
    customer: "Grace Okonkwo",
    service: "Deep Cleaning",
    time: "Tomorrow, 10:00 AM",
    location: "Victoria Island",
    price: "₦25,000",
  },
];

const ProviderDashboard = () => {
  const navigate = useNavigate();

  const handleAccept = (id: number) => {
    navigate(`/booking/${id}`);
  };

  const handleReschedule = (id: number) => {
    navigate(`/booking/${id}`);
  };

  // ... (inside return)

  <button
    onClick={() => navigate("/settings/provider")}
    className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-smooth"
  >
    <Settings className="w-6 h-6" />
    <span className="text-xs font-medium">Settings</span>
  </button>

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-6 rounded-b-3xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-md">
              Your Dashboard
            </h1>
            <p className="text-sm text-white/80 mt-1">Track your business growth</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="text-xs font-medium text-white">● Online</span>
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
          {stats.map((stat) => (
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
          ))}
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
            <div className="text-xs text-muted-foreground mt-1">₦234,500</div>
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
          {upcomingJobs.map((job) => (
            <div
              key={job.id}
              className="bg-card rounded-2xl p-4 shadow-soft border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{job.customer}</h3>
                  <p className="text-sm text-muted-foreground">{job.service}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">{job.price}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{job.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1 h-9 gradient-primary border-0 text-sm"
                  onClick={() => handleAccept(job.id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-9 text-sm"
                  onClick={() => handleReschedule(job.id)}
                >
                  Reschedule
                </Button>
              </div>
            </div>
          ))}
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
