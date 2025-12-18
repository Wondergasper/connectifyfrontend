import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Clock, Star, Sparkles, Search, Briefcase, Users, TrendingUp, Wallet, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-services.jpg";
import { ConnectionTest } from "@/components/ConnectionTest";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Connection Test - Dev Only */}
      {import.meta.env.DEV && <ConnectionTest />}

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Service marketplace"
            className="w-full h-full object-cover"
            loading="eager"
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
              Connect with verified professionals or grow your business by offering services.
            </p>

            {/* Dual Path CTAs - Customer vs Provider */}
            <div className="space-y-3 pt-6 px-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => navigate("/auth?type=customer")}
                  size="lg"
                  className="h-14 bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-strong hover:shadow-glow transition-smooth"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find Services
                </Button>
                <Button
                  onClick={() => navigate("/auth?type=provider")}
                  size="lg"
                  className="h-14 bg-accent hover:bg-accent/90 text-white font-semibold text-base shadow-strong hover:shadow-glow transition-smooth"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Become a Provider
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="w-full text-white/80 hover:text-white hover:bg-white/10"
              >
                Already have an account? Sign In →
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

      {/* Role-Specific Benefits Section */}
      <div className="py-16 px-6 bg-accent/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Your Journey Starts Here
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Customer Benefits */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-medium hover:shadow-strong transition-smooth">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">For Customers</h3>
              </div>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <Search className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">50,000+ verified professionals at your fingertips</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Book services in under 2 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Wallet className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Secure wallet payments with buyer protection</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Average 4.8★ provider rating</span>
                </li>
              </ul>

              <Button
                onClick={() => navigate("/auth?type=customer")}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Start Booking
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Provider Benefits */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-medium hover:shadow-strong transition-smooth">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">For Providers</h3>
              </div>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Reach thousands of potential clients daily</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Set your own rates and flexible schedule</span>
                </li>
                <li className="flex items-start gap-3">
                  <Wallet className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Weekly automatic payouts to your bank</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Build your reputation with verified reviews</span>
                </li>
              </ul>

              <Button
                onClick={() => navigate("/auth?type=provider")}
                className="w-full bg-accent hover:bg-accent/90"
              >
                Start Earning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
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

      {/* Footer */}
      <footer className="py-8 px-6 bg-card border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Connectify. All rights reserved.
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate('/terms')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </button>
            <button onClick={() => navigate('/privacy')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
