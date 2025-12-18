import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Shield, Calendar, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch service details
  const { data: serviceData, isLoading, isError } = useQuery({
    queryKey: ['service', id],
    queryFn: () => api.services.getById(id!),
  });

  // Fetch reviews for this service
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', 'service', id],
    queryFn: () => api.reviews.getByService(id!),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (isError || !serviceData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Service</h2>
          <p className="text-muted-foreground mb-4">Failed to load service details. Please try again later.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const service = serviceData;
  const reviews = reviewsData?.data || [];

  const handleBookService = () => {
    if (!service.provider?._id) {
      toast.error("Invalid service provider");
      return;
    }
    navigate(`/booking?serviceId=${service._id}`);
  };

  const handleMessage = () => {
    navigate(`/messages`);
    toast.info("Opening chat with service provider");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl transition-smooth">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Service Details</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Provider Profile */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl">
            {service.provider?.name?.charAt(0) || 'S'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-foreground">{service.provider?.name || service.name || 'Service Provider'}</h2>
              {service.provider?.profile?.verification?.verified && (
                <Shield className="w-5 h-5 text-accent" />
              )}
            </div>
            <p className="text-muted-foreground mb-2">{service.name || service.category || 'Service Type'}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-foreground">{service.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-muted-foreground">({service.reviewCount || 0})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{service.location?.address || service.provider?.profile?.location?.address || 'Location not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="px-6 py-4">
        <div className="p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Starting from</p>
              <p className="text-3xl font-bold text-foreground">₦{(service.price || 0).toLocaleString()}<span className="text-lg text-muted-foreground">/{service.priceType === 'hourly' ? 'hr' : 'service'}</span></p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
        <p className="text-muted-foreground leading-relaxed">
          {service.description || service.provider?.profile?.bio || "Professional service with years of experience. Specializing in quality work with attention to detail."}
        </p>
      </div>

      {/* Services Offered */}
      {service.provider?.providerDetails?.servicesOffered && service.provider.providerDetails.servicesOffered.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Services Offered</h3>
          <div className="space-y-2">
            {service.provider.providerDetails.servicesOffered.map((serviceOffered, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-foreground">{serviceOffered}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio */}
      {service.images && service.images.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Portfolio</h3>
          <div className="grid grid-cols-3 gap-3">
            {service.images.map((image, index) => (
              <div key={index} className="aspect-square rounded-xl bg-muted flex items-center justify-center">
                <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-foreground">Reviews ({reviews.length})</h3>
          <Button variant="outline" size="sm" className="text-xs">
            See all
          </Button>
        </div>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review, index) => (
              <div key={index} className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs">
                      {review.customer?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{review.customer?.name || 'Customer'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment || 'No comment provided'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to review this service!</p>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-14 flex-1"
            onClick={handleMessage}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Message
          </Button>
          <Button
            className="h-14 flex-[2] bg-accent hover:bg-accent/90 text-white font-semibold"
            onClick={handleBookService}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
