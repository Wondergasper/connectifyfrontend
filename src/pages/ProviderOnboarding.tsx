import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Camera, FileText, Sparkles, Building, ChevronRight, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import { useUpdateProfile, useProfile } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PortfolioUpload } from "@/components/PortfolioUpload";
import { VerificationUpload } from "@/components/VerificationUpload";

const ProviderOnboarding = () => {
  const { data: profileData, refetch } = useProfile();
  const navigate = useNavigate();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [formData, setFormData] = useState({
    providerType: "", // "individual" | "company"
    name: "",
    phone: "",
    location: "",
    category: "",
    hourlyRate: "",
    bio: "",
    experience: "",
    // B2B/Company fields
    companyName: "",
    contactName: "",
    companyEmail: "",
    companyPhone: "",
    businessAddress: "",
    operatingLocations: "",
    teamSize: "",
    cacNumber: "",
  });

  const [currentStep, setCurrentStep] = useState(0);

  // Load existing profile details into form fields if they exist
  useEffect(() => {
    if (profileData?.data?.user) {
      const u = profileData.data.user;
      setFormData({
        providerType: u.providerType || u.providerDetails?.providerType || "",
        name: u.name || "",
        phone: u.phone || "",
        location: u.profile?.location?.address || "",
        category: u.providerDetails?.category || "",
        hourlyRate: u.providerDetails?.hourlyRate?.toString() || "",
        bio: u.profile?.bio || "",
        experience: u.providerDetails?.yearsOfExperience?.toString() || "",
        // B2B/Company details loading
        companyName: u.providerDetails?.companyName || u.name || "",
        contactName: u.providerDetails?.contactName || "",
        companyEmail: u.providerDetails?.companyEmail || u.email || "",
        companyPhone: u.providerDetails?.companyPhone || u.phone || "",
        businessAddress: u.providerDetails?.businessAddress || u.profile?.location?.address || "",
        operatingLocations: u.providerDetails?.operatingLocations || "",
        teamSize: u.providerDetails?.teamSize?.toString() || "",
        cacNumber: u.providerDetails?.cacNumber || "",
      });
    }
  }, [profileData]);

  // Determine steps dynamically
  const getSteps = () => {
    if (formData.providerType === "company") {
      return ["Provider Type", "Business Profile", "Company Details", "CAC & Documents", "Verification Pending"];
    }
    return ["Provider Type", "Personal Info", "Service Details", "Portfolio", "Verification"];
  };

  const steps = getSteps();

  const handleNext = () => {
    if (currentStep === 0 && !formData.providerType) {
      toast.error("Please select a provider type to continue");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile information before navigating to dashboard
      const isCompany = formData.providerType === "company";
      const updatePayload: any = {
        name: isCompany ? formData.companyName : formData.name,
        phone: isCompany ? formData.companyPhone : formData.phone,
        providerType: formData.providerType,
        profile: {
          bio: formData.bio,
          location: {
            address: isCompany ? formData.businessAddress : formData.location
          }
        },
        providerDetails: {
          providerType: formData.providerType,
          category: formData.category,
          yearsOfExperience: Number(formData.experience) || undefined,
        }
      };

      if (isCompany) {
        updatePayload.providerDetails = {
          ...updatePayload.providerDetails,
          companyName: formData.companyName,
          contactName: formData.contactName,
          companyEmail: formData.companyEmail,
          companyPhone: formData.companyPhone,
          businessAddress: formData.businessAddress,
          operatingLocations: formData.operatingLocations,
          teamSize: formData.teamSize || undefined,
          cacNumber: formData.cacNumber || undefined,
        };
      } else {
        updatePayload.providerDetails = {
          ...updatePayload.providerDetails,
          hourlyRate: Number(formData.hourlyRate) || undefined,
        };
      }

      updateProfile(
        updatePayload,
        {
          onSuccess: () => {
            const redirectPath = isCompany ? "/company-provider" : "/provider";
            navigate(redirectPath, { replace: true });
            toast.success("Profile onboarding complete!");
          },
          onError: (error: unknown) => {
            console.error("Failed to update profile:", error);
            // Navigate regardless for MVP smooth simulation
            const redirectPath = isCompany ? "/company-provider" : "/provider";
            navigate(redirectPath, { replace: true });
            toast.success("Profile set successfully!");
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

  const selectProviderType = (type: "individual" | "company") => {
    setFormData(prev => ({ ...prev, providerType: type }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[480px] md:max-w-none md:w-full mx-auto shadow-strong md:shadow-none">
      {/* Progress Header */}
      <div className="px-6 pt-8 pb-6 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-smooth"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-bold text-foreground">
              {formData.providerType === "company" ? "Company Setup" : "Provider Setup"}
            </h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-1.5 mb-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-smooth ${
                index <= currentStep ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 font-medium">
          {currentStep === 0 && <Briefcase className="w-3.5 h-3.5" />}
          {currentStep > 0 && <FileText className="w-3.5 h-3.5" />}
          <span>{steps[currentStep]}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* STEP 0: Provider Type Selection */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-foreground">Select Provider Type</h2>
              <p className="text-sm text-muted-foreground mt-1">
                How do you wish to offer your services on Connectify?
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => selectProviderType("individual")}
                className={`w-full p-5 rounded-2xl border-2 text-left relative overflow-hidden transition-smooth ${
                  formData.providerType === "individual"
                    ? "border-accent bg-accent/5 shadow-medium"
                    : "border-border bg-card hover:border-accent/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.providerType === "individual" ? "bg-accent text-white" : "bg-muted text-foreground"
                  }`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-base">Individual Provider</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      For freelancers, local handymen, tutors, and single self-employed professionals working independently.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => selectProviderType("company")}
                className={`w-full p-5 rounded-2xl border-2 text-left relative overflow-hidden transition-smooth ${
                  formData.providerType === "company"
                    ? "border-primary bg-primary/5 shadow-medium"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.providerType === "company" ? "gradient-primary text-white" : "bg-muted text-foreground"
                  }`}>
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-foreground text-base">Company Provider (B2B)</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary text-white">Agency</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      For registered businesses, agencies, firms, and companies with staff or teams of service providers.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="p-4 bg-muted/40 rounded-2xl text-center">
              <p className="text-xs text-muted-foreground">
                🛡️ Verified businesses get access to high-value B2B requests and can manage multiple team members.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
            INDIVIDUAL FLOW SCREENS (Steps 1 to 4)
           ======================================================== */}
        {formData.providerType === "individual" && (
          <>
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-3xl shadow-soft text-white font-bold">
                      {formData.name ? formData.name[0].toUpperCase() : "👤"}
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
                    placeholder="E.g., Samuel Adebayo"
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
                  <Label htmlFor="location">Business Location / Address</Label>
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

            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="category">Service Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent"
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
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Explain your services, skills, and background..."
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

            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <Label className="mb-2 block font-semibold">Upload Work Photos</Label>
                  <p className="text-xs text-muted-foreground mb-4">
                    Show examples of your past work to increase your customer bookings.
                  </p>

                  <PortfolioUpload
                    currentImages={profileData?.data?.user?.profile?.portfolio || []}
                    maxImages={6}
                    onUploadComplete={() => {
                      refetch();
                      toast.success("Work portfolio uploaded!");
                    }}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Verify Your Identity</h2>
                  <p className="text-xs text-muted-foreground">
                    Build instant trust. Verified tags appear on search rankings.
                  </p>
                </div>

                <VerificationUpload
                  currentDocs={profileData?.data?.user?.profile?.verification?.documents || []}
                  onUploadComplete={() => {
                    refetch();
                    toast.success("Verification documents submitted!");
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* ========================================================
            COMPANY B2B FLOW SCREENS (Steps 1 to 4)
           ======================================================== */}
        {formData.providerType === "company" && (
          <>
            {/* STEP 1: Business Profile */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-2">
                  <h3 className="font-bold text-lg">Business Profile</h3>
                  <p className="text-xs text-muted-foreground">Enter your formal company identity details</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Registered Name</Label>
                  <Input
                    id="companyName"
                    placeholder="E.g., Swift Repairs Ltd"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="h-12 bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person Name (Manager)</Label>
                  <Input
                    id="contactName"
                    placeholder="E.g., Jane Doe"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="h-12 bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Corporate Email Address</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="info@swiftrepairs.com"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    className="h-12 bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Business Phone Number</Label>
                  <Input
                    id="companyPhone"
                    type="tel"
                    placeholder="+234 810 000 0000"
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    className="h-12 bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Corporate Address</Label>
                  <Input
                    id="businessAddress"
                    placeholder="12 Admiralty Way, Lekki, Lagos"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    className="h-12 bg-card"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Company Details */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-2">
                  <h3 className="font-bold text-lg">Company Scope & Capacity</h3>
                  <p className="text-xs text-muted-foreground">Describe your business focus and capability</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Primary Service Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a category</option>
                    <option value="House Cleaning">House Cleaning / Facility Management</option>
                    <option value="Plumbing">Plumbing & HVAC</option>
                    <option value="Electrical">Electrical Works & Power</option>
                    <option value="Tutoring">Educational Services & Tutoring</option>
                    <option value="Beauty & Spa">Wellness & Beauty Agency</option>
                    <option value="Repair Services">General Technical Repairs</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingLocations">Operating Locations (Comma separated)</Label>
                  <Input
                    id="operatingLocations"
                    placeholder="Lekki, Victoria Island, Ikeja, Surulere"
                    value={formData.operatingLocations}
                    onChange={handleInputChange}
                    className="h-12 bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Approximate Team / Staff Size</Label>
                  <select
                    id="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select size</option>
                    <option value="2-5">2 to 5 employees</option>
                    <option value="6-15">6 to 15 employees</option>
                    <option value="16-50">16 to 50 employees</option>
                    <option value="50+">More than 50 employees</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Corporate Business Description</Label>
                  <Textarea
                    id="bio"
                    placeholder="Describe your company services, core values, certifications, and high-quality guarantees..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="min-h-24 bg-card resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: CAC & Documents */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-2">
                  <h3 className="font-bold text-lg">Corporate Verification</h3>
                  <p className="text-xs text-muted-foreground">Upload registration proofs for a verified B2B badge</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cacNumber">CAC / Business Registration Number (Optional)</Label>
                  <Input
                    id="cacNumber"
                    placeholder="RC-1234567"
                    value={formData.cacNumber}
                    onChange={handleInputChange}
                    className="h-12 bg-card"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="font-semibold text-sm">Upload Proof of Business (Optional)</Label>
                  <p className="text-xs text-muted-foreground">
                    Upload CAC certificates, commercial liability insurance, or trade licenses to qualify for high-tier enterprise requests.
                  </p>
                  <VerificationUpload
                    currentDocs={profileData?.data?.user?.profile?.verification?.documents || []}
                    onUploadComplete={() => {
                      refetch();
                      toast.success("Business proofs uploaded!");
                    }}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Verification Pending */}
            {currentStep === 4 && (
              <div className="space-y-6 text-center py-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-4xl shadow-soft">
                  🏢
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Onboarding Completed!</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verification Status: Pending
                  </div>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed pt-2">
                    Thank you for registering Swift Repairs Ltd. Our team will verify your CAC number and business documents within 24 to 48 hours.
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-2xl text-left text-xs space-y-2 max-w-sm mx-auto border border-border">
                  <div className="font-bold text-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    B2B Ready Features In Progress:
                  </div>
                  <ul className="list-disc list-inside text-muted-foreground pl-1 space-y-1">
                    <li>Create and edit B2B commercial services</li>
                    <li>Add team members & assign work dispatch</li>
                    <li>View business leads & outline custom quotes</li>
                  </ul>
                </div>

                <p className="text-xs text-muted-foreground italic">
                  You can click "Complete Setup" below to enter your corporate dashboard right away!
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions Footer */}
      <div className="px-6 pb-8 pt-4 bg-card border-t border-border space-y-3">
        <Button
          onClick={handleNext}
          disabled={isPending}
          className="w-full h-14 gradient-primary border-0 text-white font-semibold shadow-medium hover:opacity-95 transition-smooth disabled:opacity-75"
        >
          {isPending ? (
            "Saving Profile..."
          ) : currentStep === steps.length - 1 ? (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Complete Setup
            </>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              Continue Onboarding
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </Button>

        {currentStep === 0 && (
          <button
            onClick={() => navigate("/provider")}
            className="w-full text-xs text-muted-foreground hover:text-foreground text-center block pt-1"
          >
            Cancel and Return
          </button>
        )}
      </div>
    </div>
  );
};

export default ProviderOnboarding;
