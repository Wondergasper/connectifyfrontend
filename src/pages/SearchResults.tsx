import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, SlidersHorizontal, Star, MapPin, User, X, TrendingUp, DollarSign, Shield, Clock } from "lucide-react";
import { useSearchServices } from "@/hooks/useServices";
import { toast } from "sonner";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('relevance');
  const [activeFilter, setActiveFilter] = useState('all');

  // Extract parameters from URL
  const categoryParam = searchParams.get('category') || '';
  const locationParam = searchParams.get('location') || '';

  // Use search parameters for API call
  const { data: searchData, isLoading } = useSearchServices({
    search: searchInput,
    category: categoryParam,
    location: locationParam
  });

  let providers = searchData?.data || [];

  // Apply client-side filtering and sorting
  if (activeFilter !== 'all') {
    switch (activeFilter) {
      case 'available':
        providers = providers.filter(p => p.availability?.status !== 'unavailable');
        break;
      case 'topRated':
        providers = providers.filter(p => (p.averageRating || 0) >= 4.5);
        break;
      case 'verified':
        providers = providers.filter(p => p.provider?.profile?.verification?.verified);
        break;
    }
  }

  // Apply sorting
  if (sortBy !== 'relevance') {
    providers = [...providers].sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return (a.price || 0) - (b.price || 0);
        case 'priceDesc':
          return (b.price || 0) - (a.price || 0);
        case 'ratingDesc':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (searchInput.trim()) newParams.set('search', searchInput.trim());
    if (categoryParam) newParams.set('category', categoryParam);
    if (locationParam) newParams.set('location', locationParam);
    setSearchParams(newParams);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    const newParams = new URLSearchParams();
    if (categoryParam) newParams.set('category', categoryParam);
    if (locationParam) newParams.set('location', locationParam);
    setSearchParams(newParams);
  };

  // Remove filter pill
  const removeFilter = (filterType: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(filterType);
    setSearchParams(newParams);
    if (filterType === 'category') {
      toast.success('Category filter removed');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl transition-smooth">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for services or providers..."
                className="h-12 pl-12 pr-12 bg-muted/30 border-0"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-smooth"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </form>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{providers.length}</span> {providers.length === 1 ? 'provider' : 'providers'}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-lg bg-muted/30 border border-border text-foreground cursor-pointer hover:bg-muted/50 transition-smooth"
            >
              <option value="relevance">Most Relevant</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingDesc">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Pills */}
      {(categoryParam || searchInput) && (
        <div className="px-6 py-3 flex gap-2 flex-wrap">
          {searchInput && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm">
              <Search className="w-3.5 h-3.5" />
              <span>"{searchInput}"</span>
              <button onClick={handleClearSearch} className="hover:opacity-70">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {categoryParam && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm">
              <span>{categoryParam}</span>
              <button onClick={() => removeFilter('category')} className="hover:opacity-70">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Filters */}
      <div className="px-6 py-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'All', icon: null },
            { id: 'available', label: 'Available Now', icon: Clock },
            { id: 'topRated', label: 'Top Rated', icon: Star },
            { id: 'verified', label: 'Verified', icon: Shield }
          ].map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-smooth flex items-center gap-2 ${activeFilter === filter.id
                    ? "bg-primary text-white shadow-medium"
                    : "bg-muted/30 text-foreground hover:bg-muted/50"
                  }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results List */}
      <div className="px-6 space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full p-4 rounded-2xl bg-card border border-border shadow-soft animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))
        ) : providers.length > 0 ? (
          // Results
          providers.map((service) => (
            <button
              key={service._id}
              onClick={() => navigate(`/service/${service._id}`)}
              className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary transition-smooth text-left shadow-soft hover:shadow-medium group"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft group-hover:shadow-medium transition-smooth">
                  {service.provider?.profile?.avatar ? (
                    <img
                      src={service.provider.profile.avatar}
                      alt={service.provider.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {service.provider?.name || service.name}
                        </h3>
                        {service.provider?.profile?.verification?.verified && (
                          <Shield className="w-4 h-4 text-primary fill-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{service.name || service.category}</p>
                    </div>
                    {service.availability?.status !== 'unavailable' && (
                      <span className="px-2 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-xs font-medium text-green-700 dark:text-green-300 whitespace-nowrap">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-foreground">{service.averageRating?.toFixed(1) || '0.0'}</span>
                      <span className="text-muted-foreground">({service.reviewCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">
                        {service.location?.address || service.provider?.profile?.location?.address || 'Location not specified'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <span className="text-lg font-bold text-primary">
                      ₦{(service.price || 0).toLocaleString()}/{service.priceType === 'hourly' ? 'hr' : 'service'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No providers found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchInput || categoryParam
                ? "Try adjusting your search or filters to find what you need"
                : "No services available at the moment"
              }
            </p>
            {(searchInput || categoryParam) && (
              <Button
                onClick={() => {
                  setSearchInput('');
                  setSearchParams(new URLSearchParams());
                  setActiveFilter('all');
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
