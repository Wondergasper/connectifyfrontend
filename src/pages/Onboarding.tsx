import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Users, Briefcase, Shield } from "lucide-react";

const slides = [
  {
    icon: Users,
    title: "Find trusted professionals near you",
    description: "Connect with verified service providers across Nigeria. Quality you can trust.",
  },
  {
    icon: Briefcase,
    title: "Offer your skills, grow your income",
    description: "Join our marketplace and reach thousands of customers looking for your expertise.",
  },
  {
    icon: Shield,
    title: "Pay securely. Get the job done",
    description: "Book services, track progress, and pay safely through our secure wallet system.",
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/auth");
    }
  };

  const handleSkip = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Status bar simulation */}
      <div className="h-12 flex items-center justify-between px-6">
        <div className="text-xs text-muted-foreground">9:41</div>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-full bg-muted" />
          <div className="w-4 h-4 rounded-full bg-muted" />
          <div className="w-4 h-4 rounded-full bg-muted" />
        </div>
      </div>

      {/* Skip button */}
      <div className="px-6 py-4 text-right">
        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-3xl gradient-primary flex items-center justify-center shadow-strong">
              {(() => {
                const Icon = slides[currentSlide].icon;
                return <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />;
              })()}
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl font-bold text-foreground leading-tight text-balance">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-smooth ${
                  index === currentSlide
                    ? "w-8 bg-primary"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleNext}
            className="w-full h-14 text-base font-semibold gradient-primary border-0 hover:opacity-90 transition-smooth shadow-medium"
            size="lg"
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
