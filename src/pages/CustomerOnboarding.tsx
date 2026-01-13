import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { MapPin, User, Phone, CheckCircle } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useAuth";
import { toast } from "sonner";
import { api } from "@/lib/api";

const steps = ["Personal Details", "Location", "Preferences"];

const CustomerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    interests: [] as string[],
  });
  const navigate = useNavigate();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const services = [
    "Plumbing", "Cleaning", "Electrical", "Tutoring",
    "Beauty", "Repair", "Cooking", "Gardening"
  ];

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
            bio: formData.interests.join(', '),
            location: {
              address: formData.location
            }
          }
        },
        {
          onSuccess: () => {
            navigate("/customer");
            toast.success("Profile updated successfully!");
          },
          onError: (error: unknown) => {
            console.error("Failed to update profile:", error);
            // Still navigate to dashboard even if update fails
            navigate("/customer");
            toast.error("Failed to save profile information, but you can continue");
          }
        }
      );
    }
  };

  const toggleInterest = (service: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(service)
        ? prev.interests.filter(s => s !== service)
        : [...prev.interests, service]
    }));
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.info('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Call backend API to convert coordinates to address
          const response = await api.location.reverseGeocode(latitude, longitude);

          if (response.success && response.data) {
            setFormData(prev => ({
              ...prev,
              location: response.data.formattedAddress
            }));
            toast.success('Location detected!');
          } else {
            // Fallback to coordinates
            const locationString = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
            setFormData(prev => ({
              ...prev,
              location: locationString
            }));
            toast.success('Location detected (coordinates)');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          // Fallback to coordinates
          const locationString = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
          setFormData(prev => ({
            ...prev,
            location: locationString
          }));
          toast.warning('Using coordinates');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enter manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('Failed to get your location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Responsive Container */}
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="px-6 md:px-8 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-foreground">Complete Your Profile</h1>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1}/{steps.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-smooth ${index <= currentStep ? "bg-primary" : "bg-border"
                  }`}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-4">{steps[currentStep]}</p>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 md:px-8 pb-6">
          {currentStep === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="fullname"
                    placeholder="Samuel Adebayo"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-11 h-12 bg-card border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-11 h-12 bg-card border-border"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Your Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Lekki, Lagos"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="pl-11 h-12 bg-card border-border"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={handleUseCurrentLocation}
                type="button"
              >
                📍 Use Current Location
              </Button>

              <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  We'll show you professionals near this location
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  What services are you interested in?
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select all that apply
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {services.map((service) => (
                    <button
                      key={service}
                      onClick={() => toggleInterest(service)}
                      className={`p-4 rounded-xl border-2 transition-smooth text-left ${formData.interests.includes(service)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-muted-foreground/30"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{service}</span>
                        {formData.interests.includes(service) && (
                          <CheckCircle className="w-4 h-4 text-primary" fill="currentColor" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 md:px-8 pb-8 space-y-3">
          <Button
            onClick={handleNext}
            disabled={isPending}
            className="w-full h-14 gradient-primary border-0 font-semibold shadow-medium disabled:opacity-70"
          >
            {isPending ? "Saving..." : currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}
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
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboarding;
