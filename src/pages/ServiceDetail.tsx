import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Shield, Calendar, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useService } from "@/hooks/useServices";
import ServiceDetailSkeleton from "@/components/ServiceDetailSkeleton";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch service details
  const { data: serviceData, isLoading, isError } = useService(id!);

  // Fetch reviews for this service
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', 'service', id],
    queryFn: () => api.reviews.getByService(id!),
    enabled: !!id
  });

  if (isLoading) {
    return <ServiceDetailSkeleton />;
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
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl text-white font-bold shadow-medium">
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
        <div className="p-5 rounded-2xl bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Starting from</p>
              <p className="text-3xl font-bold text-foreground">₦{(service.price || 0).toLocaleString()}<span className="text-lg text-muted-foreground font-normal">/{service.priceType === 'hourly' ? 'hr' : 'service'}</span></p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold text-accent">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          About
          <div className="h-1 w-8 bg-primary rounded-full" />
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {service.description || service.provider?.profile?.bio || "Professional service with years of experience. Specializing in quality work with attention to detail."}
        </p>
      </div>

      {/* Services Offered */}
      {service.provider?.providerDetails?.servicesOffered && service.provider.providerDetails.servicesOffered.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-lg font-bold text-foreground mb-3">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            {service.provider.providerDetails.servicesOffered.map((serviceOffered, index) => (
              <div key={index} className="px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm font-medium text-foreground">
                {serviceOffered}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio */}
      {service.images && service.images.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-lg font-bold text-foreground mb-3">Portfolio</h3>
          <div className="grid grid-cols-3 gap-3">
            {service.images.map((image, index) => (
              <div key={index} className="aspect-square rounded-xl bg-muted overflow-hidden shadow-soft">
                <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover transition-transform hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-foreground">Reviews ({reviews.length})</h3>
          <Button variant="ghost" size="sm" className="text-primary font-bold">
            See all
          </Button>
        </div>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review, index) => (
              <div key={index} className="p-4 rounded-2xl bg-card border border-border shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold shadow-soft">
                      {review.customer?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{review.customer?.name || 'Customer'}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment || 'No comment provided'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/20 rounded-2xl border border-dashed border-border">
            <p className="text-sm text-muted-foreground font-medium">No reviews yet. Be the first!</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border z-20">
        <div className="flex gap-4 max-w-2xl mx-auto">
          <Button
            variant="outline"
            className="h-14 flex-1 rounded-2xl border-2 font-bold shadow-soft"
            onClick={handleMessage}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Message
          </Button>
          <Button
            className="h-14 flex-[2] bg-accent hover:bg-accent/90 text-white font-bold text-lg rounded-2xl shadow-glow active:scale-95 transition-all"
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
