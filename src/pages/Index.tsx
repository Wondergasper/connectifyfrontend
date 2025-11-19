import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Clock, Star, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-services.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Service marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative w-full px-6 py-12 text-center">
          <div className="space-y-8 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-soft">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white">Trusted by 50,000+ Nigerians</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight px-2 drop-shadow-lg">
              Find trusted services,
              <br />
              <span className="text-primary drop-shadow-glow">anytime, anywhere</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-lg mx-auto px-2 leading-relaxed drop-shadow-md">
              Connect with verified professionals for home services, tutoring, repairs, and more.
            </p>

            <div className="flex flex-col gap-3 pt-6 px-2">
              <Button
                onClick={() => navigate("/onboarding")}
                size="lg"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-strong hover:shadow-glow transition-smooth"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/auth")}
                className="w-full h-14 bg-white/15 border-white/30 text-white hover:bg-white/25 backdrop-blur-md font-medium text-base transition-smooth"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-background">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Why Choose Connectify?
        </h2>

        <div className="space-y-5 max-w-2xl mx-auto">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-smooth">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-soft">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Verified Professionals</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              All service providers are verified and background-checked for your safety.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-smooth">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-soft">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Quick Booking</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Book services in minutes and get instant confirmation from providers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-smooth">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-soft">
              <Star className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Trusted Reviews</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Read authentic reviews from real customers to make informed decisions.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 px-6 bg-accent/5">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to get started?
          </h2>
          <p className="text-base text-muted-foreground">
            Join thousands of satisfied customers and service providers today.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-semibold"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
