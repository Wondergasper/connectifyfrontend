import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Camera, FileText, Sparkles } from "lucide-react";

const steps = ["Personal Info", "Service Details", "Portfolio", "Verification"];

const ProviderOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show confetti animation
      navigate("/provider");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">Setup Your Business</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-smooth ${
                index <= currentStep ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {currentStep === 0 && <User className="w-4 h-4" />}
          {currentStep === 1 && <Briefcase className="w-4 h-4" />}
          {currentStep === 2 && <Camera className="w-4 h-4" />}
          {currentStep === 3 && <FileText className="w-4 h-4" />}
          <span>{steps[currentStep]}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {currentStep === 0 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-4xl">
                  👤
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-medium">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Your full name" className="h-12 bg-card" />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+234 800 000 0000" className="h-12 bg-card" />
            </div>

            <div className="space-y-2">
              <Label>Business Location</Label>
              <Input placeholder="Lekki, Lagos" className="h-12 bg-card" />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <Label>Service Category</Label>
              <select className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground">
                <option>Select a category</option>
                <option>House Cleaning</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Tutoring</option>
                <option>Beauty & Spa</option>
                <option>Repair Services</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Hourly Rate (₦)</Label>
              <Input type="number" placeholder="8000" className="h-12 bg-card" />
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                placeholder="Tell customers about your experience and expertise..."
                className="min-h-32 bg-card resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <Input type="number" placeholder="5" className="h-12 bg-card" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <Label className="mb-3 block">Upload Work Photos</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Show potential customers examples of your work
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <button
                    key={item}
                    className="aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-smooth flex flex-col items-center justify-center gap-2"
                  >
                    <Camera className="w-8 h-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-xl">
              <p className="text-xs text-accent text-center">
                💡 Tip: Clear, well-lit photos help you get more bookings
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Verify Your Identity
              </h2>
              <p className="text-sm text-muted-foreground">
                This helps build trust with customers
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full p-4 rounded-xl border-2 border-border bg-card hover:border-primary transition-smooth text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                    🪪
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">National ID</div>
                    <div className="text-xs text-muted-foreground">NIN, Driver's License, or Voter's Card</div>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 rounded-xl border-2 border-border bg-card hover:border-primary transition-smooth text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                    📄
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">Business Document</div>
                    <div className="text-xs text-muted-foreground">Registration or License (Optional)</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                🔒 Your documents are encrypted and securely stored
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-8 space-y-3">
        <Button
          onClick={handleNext}
          className="w-full h-14 bg-accent hover:bg-accent/90 text-white border-0 font-semibold shadow-medium"
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Complete Setup
            </>
          ) : (
            "Continue"
          )}
        </Button>

        {currentStep > 0 && (
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full"
          >
            Back
          </Button>
        )}

        {currentStep < steps.length - 1 && (
          <button
            onClick={() => navigate("/provider")}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
};

export default ProviderOnboarding;
