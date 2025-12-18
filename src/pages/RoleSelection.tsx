import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, CheckCircle } from "lucide-react";
import { useUpdateRole } from "@/hooks/useAuth";
import { toast } from "sonner";

type Role = "customer" | "provider" | null;

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const navigate = useNavigate();
  const { mutate: updateRole, isPending } = useUpdateRole();

  const handleContinue = () => {
    if (selectedRole) {
      updateRole(selectedRole, {
        onSuccess: () => {
          if (selectedRole === "customer") {
            navigate("/customer-onboarding");
          } else if (selectedRole === "provider") {
            navigate("/provider-onboarding");
          }
        },
        onError: (error: unknown) => {
          console.error("Failed to update role:", error);
          // Still allow navigation even if role update fails
          if (selectedRole === "customer") {
            navigate("/customer-onboarding");
          } else if (selectedRole === "provider") {
            navigate("/provider-onboarding");
          }
          toast.error("Failed to save your role selection, but you can continue");
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Choose Your Role</h1>
        <p className="text-muted-foreground">How do you plan to use Connectify?</p>
      </div>

      {/* Role Cards */}
      <div className="flex-1 px-6 pb-12 space-y-4">
        {/* Customer Card */}
        <button
          onClick={() => setSelectedRole("customer")}
          className={`w-full p-6 rounded-2xl border-2 transition-smooth text-left relative overflow-hidden ${
            selectedRole === "customer"
              ? "border-primary bg-primary/5 shadow-medium"
              : "border-border bg-card hover:border-muted-foreground/30"
          }`}
        >
          {selectedRole === "customer" && (
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-smooth ${
              selectedRole === "customer" ? "gradient-primary" : "bg-muted"
            }`}>
              <User className={`w-7 h-7 ${selectedRole === "customer" ? "text-white" : "text-foreground"}`} strokeWidth={2} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                I'm a Customer
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Find and book trusted professionals for services like plumbing, cleaning, tutoring, and more.
              </p>
            </div>
          </div>
        </button>

        {/* Provider Card */}
        <button
          onClick={() => setSelectedRole("provider")}
          className={`w-full p-6 rounded-2xl border-2 transition-smooth text-left relative overflow-hidden ${
            selectedRole === "provider"
              ? "border-accent bg-accent/5 shadow-medium"
              : "border-border bg-card hover:border-muted-foreground/30"
          }`}
        >
          {selectedRole === "provider" && (
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-6 h-6 text-accent" fill="currentColor" />
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-smooth ${
              selectedRole === "provider" ? "bg-accent" : "bg-muted"
            }`}>
              <Briefcase className={`w-7 h-7 ${selectedRole === "provider" ? "text-white" : "text-foreground"}`} strokeWidth={2} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                I'm a Service Provider
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Offer your skills and services to thousands of customers. Build your business and grow your income.
              </p>
            </div>
          </div>
        </button>

        {/* Benefits */}
        <div className="pt-6">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground text-center">
              💡 You can switch roles anytime in your profile settings
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-8">
        <Button
          onClick={handleContinue}
          disabled={!selectedRole || isPending}
          className="w-full h-14 text-base font-semibold gradient-primary border-0 hover:opacity-90 transition-smooth shadow-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default RoleSelection;
