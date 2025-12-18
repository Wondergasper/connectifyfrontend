import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Camera, FileText, Sparkles } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PortfolioUpload } from "@/components/PortfolioUpload";
import { VerificationUpload } from "@/components/VerificationUpload";

const steps = ["Personal Info", "Service Details", "Portfolio", "Verification"];

const ProviderOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    category: "",
    hourlyRate: "",
    bio: "",
    experience: "",
  });
  const navigate = useNavigate();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile information before navigating to dashboard
      updateProfile(
        {
          name: formData.name,
          phone: formData.phone,
          profile: {
            bio: formData.bio,
            location: {
              address: formData.location
            }
          },
          providerDetails: {
            category: formData.category,
            hourlyRate: Number(formData.hourlyRate) || undefined,
            yearsOfExperience: Number(formData.experience) || undefined
          }
        },
        {
          onSuccess: () => {
            navigate("/provider");
            toast.success("Profile updated successfully!");
          },
          onError: (error: unknown) => {
            console.error("Failed to update profile:", error);
            // Still navigate to dashboard even if update fails
            navigate("/provider");
            toast.error("Failed to save profile information, but you can continue");
          }
        }
      );
    }
  };

  // Handler for all form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
              className={`h-1.5 flex-1 rounded-full transition-smooth ${index <= currentStep ? "bg-accent" : "bg-border"
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="h-12 bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-12 bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Business Location</Label>
              <Input
                id="location"
                placeholder="Lekki, Lagos"
                value={formData.location}
                onChange={handleInputChange}
                className="h-12 bg-card"
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="category">Service Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground"
              >
                <option value="">Select a category</option>
                <option value="House Cleaning">House Cleaning</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Tutoring">Tutoring</option>
                <option value="Beauty & Spa">Beauty & Spa</option>
                <option value="Repair Services">Repair Services</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (₦)</Label>
              <Input
                id="hourlyRate"
                type="number"
                placeholder="8000"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="h-12 bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell customers about your experience and expertise..."
                value={formData.bio}
                onChange={handleInputChange}
                className="min-h-32 bg-card resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="5"
                value={formData.experience}
                onChange={handleInputChange}
                className="h-12 bg-card"
              />
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

              <PortfolioUpload
                currentImages={[]}
                maxImages={6}
                onUploadComplete={() => {
                  toast.success("Photos uploaded! You can add more later from your profile.");
                }}
              />
            </div>

            <div className="p-4 bg-accent/10 rounded-xl">
              <p className="text-xs text-accent text-center">
                💡 Tip: Clear, well-lit photos help you get more bookings
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground text-center">
                Don't worry! You can add or change photos anytime from your profile
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

            <VerificationUpload
              onUploadComplete={() => {
                toast.success("Documents uploaded! We'll verify them within 24-48 hours.");
              }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-8 space-y-3">
        <Button
          onClick={handleNext}
          disabled={isPending}
          className="w-full h-14 bg-accent hover:bg-accent/90 text-white border-0 font-semibold shadow-medium disabled:opacity-70"
        >
          {isPending ? (
            "Saving..."
          ) : (
            currentStep === steps.length - 1 ? (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Complete Setup
              </>
            ) : (
              "Continue"
            )
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
            onClick={() => !isPending && navigate("/provider")}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50"
            disabled={isPending}
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
};

export default ProviderOnboarding;
