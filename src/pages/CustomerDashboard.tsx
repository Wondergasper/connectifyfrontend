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

const categories = [
  { name: "Plumbing", icon: Wrench },
  { name: "Cleaning", icon: Sparkles },
  { name: "Electrical", icon: Zap },
  { name: "Tutoring", icon: BookOpen },
  { name: "Beauty", icon: Scissors },
  { name: "Repair", icon: Hammer },
];

const featuredProviders = [
  {
    id: 1,
    name: "Chioma Nwosu",
    service: "House Cleaning",
    rating: 4.9,
    reviews: 127,
    distance: "2.3 km",
    price: "₦8,000/hr",
    verified: true,
  },
  {
    id: 2,
    name: "Ibrahim Musa",
    service: "Plumbing Expert",
    rating: 4.8,
    reviews: 94,
    distance: "1.8 km",
    price: "₦12,000/hr",
    verified: true,
  },
  {
    id: 3,
    name: "Blessing Okafor",
    service: "Math Tutor",
    rating: 5.0,
    reviews: 156,
    distance: "3.5 km",
    price: "₦5,000/hr",
    verified: true,
  },
];

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-8 rounded-b-[2rem] shadow-strong">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Hi, Samuel 👋
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
            <button
              onClick={() => navigate("/bookings")}
              className="text-center hover:scale-105 transition-smooth"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground">Bookings</div>
            </button>
            <div className="text-center border-x border-border">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div className="text-xl font-bold text-foreground">4.8</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
            <button
              onClick={() => navigate("/wallet/customer")}
              className="text-center hover:scale-105 transition-smooth"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl font-bold text-foreground">₦45k</div>
              <div className="text-xs text-muted-foreground">Balance</div>
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Categories</h2>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => navigate("/search")}
                className="bg-card rounded-2xl p-5 text-center hover:shadow-medium transition-smooth border border-border hover:border-primary/20 group"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3 shadow-soft group-hover:shadow-medium transition-smooth">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-medium text-foreground">{category.name}</div>
              </button>
            );
          })}
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
          {featuredProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => navigate("/booking")}
              className="w-full bg-card rounded-2xl p-5 shadow-soft border border-border hover:shadow-strong hover:border-primary/20 transition-smooth text-left group"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-medium flex-shrink-0 group-hover:shadow-strong transition-smooth">
                  <User className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-base">{provider.name}</h3>
                        {provider.verified && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-soft">
                            <Shield className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{provider.service}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span className="font-semibold text-foreground">{provider.rating}</span>
                      <span>({provider.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{provider.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{provider.price}</span>
                    <Button size="sm" className="h-9 px-5 shadow-soft group-hover:shadow-medium transition-smooth">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </button>
          ))}
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
