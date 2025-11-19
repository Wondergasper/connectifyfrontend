import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, SlidersHorizontal, Star, MapPin, User } from "lucide-react";

const SearchResults = () => {
  const navigate = useNavigate();

  const providers = [
    { id: 1, name: "Chioma Nwosu", service: "House Cleaning", rating: 4.9, reviews: 127, price: 8000, location: "Lekki", available: true },
    { id: 2, name: "Emeka Okafor", service: "Plumbing", rating: 4.8, reviews: 93, price: 10000, location: "Victoria Island", available: true },
    { id: 3, name: "Fatima Hassan", service: "Tutoring", rating: 5.0, reviews: 156, price: 5000, location: "Ikeja", available: false },
    { id: 4, name: "Oluwaseun Adeyemi", service: "Electrical", rating: 4.7, reviews: 81, price: 12000, location: "Surulere", available: true },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl transition-smooth">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for services..."
                className="h-12 pl-12 pr-4 bg-muted/30 border-0"
                defaultValue="House Cleaning"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{providers.length} providers</span>
            </p>
            <Button variant="ghost" size="sm" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-6 py-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["All", "Available Now", "Top Rated", "Nearby", "Best Value"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-smooth ${
                filter === "All"
                  ? "bg-accent text-white"
                  : "bg-muted/30 text-foreground hover:bg-muted/50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="px-6 space-y-4">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => navigate(`/service/${provider.id}`)}
            className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary transition-smooth text-left shadow-soft hover:shadow-medium"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
                <User className="w-10 h-10 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">{provider.service}</p>
                  </div>
                  {provider.available && (
                    <span className="px-2 py-1 rounded-lg bg-accent/10 text-xs font-medium text-accent whitespace-nowrap">
                      Available
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-foreground">{provider.rating}</span>
                    <span className="text-muted-foreground">({provider.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.location}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Starting from</span>
                  <span className="text-lg font-bold text-foreground">₦{provider.price.toLocaleString()}/hr</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
