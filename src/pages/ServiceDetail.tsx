import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Shield, Calendar } from "lucide-react";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
            👤
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-foreground">Chioma Nwosu</h2>
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <p className="text-muted-foreground mb-2">Professional House Cleaner</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-foreground">4.9</span>
                <span className="text-muted-foreground">(127)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Lekki, Lagos</span>
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
              <p className="text-3xl font-bold text-foreground">₦8,000<span className="text-lg text-muted-foreground">/hr</span></p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Available Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
        <p className="text-muted-foreground leading-relaxed">
          Professional cleaning service with 8+ years of experience. Specializing in residential and commercial cleaning. 
          I provide thorough, reliable service with attention to detail. All cleaning supplies included.
        </p>
      </div>

      {/* Services Offered */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">Services Offered</h3>
        <div className="space-y-2">
          {["Deep Cleaning", "Regular Maintenance", "Move-in/Move-out Cleaning", "Laundry Services"].map((service) => (
            <div key={service} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-foreground">{service}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">Portfolio</h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="aspect-square rounded-xl bg-muted flex items-center justify-center text-3xl">
              🏠
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">Reviews (127)</h3>
        <div className="space-y-4">
          {[
            { name: "Samuel O.", rating: 5, comment: "Excellent service! Very professional and thorough.", time: "2 days ago" },
            { name: "Ada K.", rating: 5, comment: "Highly recommend! My apartment has never been cleaner.", time: "1 week ago" },
          ].map((review, index) => (
            <div key={index} className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-14 flex-1"
            onClick={() => navigate("/messages")}
          >
            Message
          </Button>
          <Button
            className="h-14 flex-[2] bg-accent hover:bg-accent/90 text-white font-semibold"
            onClick={() => navigate("/booking")}
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
