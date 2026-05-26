import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Star, Sparkles, Search, Briefcase, Users, TrendingUp, Wallet, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-services.jpg";
import { ConnectionTest } from "@/components/ConnectionTest";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Connection Test - Dev Only */}
      {import.meta.env.DEV && <ConnectionTest />}

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-transparent">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white drop-shadow-md">Connectify</div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 hidden sm:flex">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-glow">
              <Link to="/auth" state={{ from: { pathname: "/customer" }, role: "customer", showLoginFirst: true }}>Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Service marketplace"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        </div>

        <div className="relative w-full px-6 py-12 text-center mt-16 z-10">
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-soft animate-in fade-in slide-in-from-top-4 duration-700">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white">Trusted by 50,000+ Nigerians</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight px-2 drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Find trusted services,
              <br />
              <span className="text-primary drop-shadow-glow">anytime, anywhere</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-xl mx-auto px-2 leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Connect with verified professionals or grow your business by offering services on Nigeria's leading marketplace.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto min-w-[200px] h-16 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-strong hover:shadow-glow transition-all active:scale-95 cursor-pointer relative z-20"
              >
                <Link to="/auth" state={{ from: { pathname: "/customer" }, role: "customer", showLoginFirst: true }}>
                  <Search className="w-5 h-5 mr-2" />
                  Find Services
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] h-16 bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20 text-white font-bold text-lg shadow-strong transition-all active:scale-95 cursor-pointer relative z-20"
              >
                <Link to="/auth" state={{ from: { pathname: "/provider-onboarding" }, role: "provider", showLoginFirst: true }}>
                  <Briefcase className="w-5 h-5 mr-2" />
                  Become a Provider
                </Link>
              </Button>
            </div>

            <div className="pt-4 animate-in fade-in duration-1000 delay-500">
              <Link to="/auth" className="text-white/80 hover:text-primary transition-all flex items-center justify-center gap-2 text-sm font-medium group relative z-20">
                Already have an account? <span className="underline decoration-primary/50 group-hover:decoration-primary">Sign In</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 bg-background relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose Connectify?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've built Nigeria's most secure and reliable platform for connecting service seekers with verified professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-soft">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Verified Professionals</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every service provider undergoes a rigorous identity and background check before joining our network.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-soft">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Instant Booking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Check real-time availability and book your service in under two minutes with instant confirmation.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-soft">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Trusted Reviews</h3>
              <p className="text-muted-foreground leading-relaxed">
                Make informed decisions based on thousands of authentic reviews from customers in your local area.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Benefits Section */}
      <div className="py-24 px-6 bg-accent/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Your Journey Starts Here
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Customer Benefits */}
            <div className="p-10 rounded-3xl bg-card border border-border shadow-medium hover:shadow-strong transition-smooth relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">For Customers</h3>
                </div>

                <ul className="space-y-6 mb-10">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <Search className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-lg text-muted-foreground font-medium">50,000+ verified professionals across 20+ categories</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-lg text-muted-foreground font-medium">Book express services for same-day delivery</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <Wallet className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-lg text-muted-foreground font-medium">Secure payments with escrow protection</span>
                  </li>
                </ul>

                <Button
                  asChild
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 h-14 text-lg font-bold shadow-soft relative z-20"
                >
                  <Link to="/auth" state={{ from: { pathname: "/customer" }, role: "customer", showLoginFirst: true }}>
                    Start Booking Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Provider Benefits */}
            <div className="p-10 rounded-3xl bg-card border border-border shadow-medium hover:shadow-strong transition-smooth relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">For Providers</h3>
                </div>

                <ul className="space-y-6 mb-10">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-lg text-muted-foreground font-medium">Increase your earnings by up to 300% monthly</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-lg text-muted-foreground font-medium">Total control over your schedule and pricing</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <Wallet className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-lg text-muted-foreground font-medium">Get paid instantly upon job completion</span>
                  </li>
                </ul>

                <Button
                  asChild
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 h-14 text-lg font-bold shadow-soft relative z-20"
                >
                  <Link to="/auth" state={{ from: { pathname: "/provider-onboarding" }, role: "provider", showLoginFirst: true }}>
                    Grow Your Business
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 bg-background relative z-10 border-t border-border">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground">
            Ready to experience the future of service delivery?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join 50,000+ Nigerians who trust Connectify for their daily needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold text-lg relative z-20"
            >
              <Link to="/auth">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-bold text-foreground">Connectify</div>
            
            <nav className="flex flex-wrap justify-center gap-8">
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">Login</Link>
              <Link to="/auth" state={{ from: { pathname: "/provider-onboarding" }, role: "provider", showLoginFirst: true }} className="text-sm text-muted-foreground hover:text-primary transition-colors">Be a Provider</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
              <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin
              </Link>
            </nav>

            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Connectify Nigeria.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
