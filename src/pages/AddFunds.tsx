import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShieldCheck, Zap, ExternalLink } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useInitializePayment, useVerifyPayment } from "@/hooks/useWallet";

const QUICK_AMOUNTS = [1000, 5000, 10000, 20000, 50000];

const AddFunds = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { mutate: initializePayment, isPending: isInitializing } = useInitializePayment();
  const { mutate: verifyPayment } = useVerifyPayment();

  // Handle Paystack callback — URL will contain ?reference=xxx&trxref=xxx
  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    if (reference && !isVerifying) {
      setIsVerifying(true);
      toast.loading("Verifying payment...", { id: "verify-payment" });
      verifyPayment(reference, {
        onSuccess: () => {
          toast.dismiss("verify-payment");
          setTimeout(() => navigate("/customer"), 1500);
        },
        onError: () => {
          toast.dismiss("verify-payment");
          setIsVerifying(false);
        },
      });
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProceed = () => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 100) {
      toast.error("Minimum amount is ₦100");
      return;
    }
    if (amountValue > 10_000_000) {
      toast.error("Maximum amount is ₦10,000,000");
      return;
    }

    initializePayment(amountValue, {
      onSuccess: (data) => {
        const url = data?.data?.authorizationUrl;
        if (url) {
          // Redirect to Paystack checkout
          window.location.href = url;
        } else {
          toast.error("Failed to get payment URL");
        }
      },
    });
  };

  const isPending = isInitializing || isVerifying;

  // Show verifying state if we're on the callback route
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Verifying Payment</h2>
          <p className="text-muted-foreground text-sm">Please wait while we confirm your transaction…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-20 rounded-b-[3rem] relative overflow-hidden shadow-strong">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Add Funds</h1>
          <p className="text-white/80 text-sm">Top up your wallet securely via Paystack</p>
        </div>
      </div>

      <div className="px-6 -mt-16">
        <div className="bg-card rounded-3xl p-6 shadow-strong border border-border relative z-10 space-y-6">

          {/* Amount input */}
          <div className="space-y-4">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center block">
              Enter Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold text-2xl">₦</span>
              <Input
                type="number"
                placeholder="0.00"
                className="pl-10 text-3xl font-bold h-20 text-center bg-muted/30 border-border/50 focus:bg-background transition-smooth rounded-2xl"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isPending}
                min={100}
              />
            </div>
          </div>

          {/* Quick-select amounts */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-3">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(String(val))}
                  disabled={isPending}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-smooth ${
                    amount === String(val)
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted/20 border-border hover:bg-primary/5 hover:border-primary/30"
                  }`}
                >
                  ₦{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Payment method info */}
          <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Paystack</p>
              <p className="text-xs text-muted-foreground">Cards · Bank Transfer · USSD · Pay with Bank</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Proceed button */}
          <Button
            onClick={handleProceed}
            disabled={isPending || !amount}
            className="w-full gradient-primary border-0 h-14 text-lg font-semibold shadow-medium hover:shadow-strong transition-all hover:scale-[1.02] rounded-xl"
          >
            {isInitializing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Connecting to Paystack…
              </>
            ) : (
              "Pay with Paystack →"
            )}
          </Button>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground opacity-70">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-bit encryption · Secured by Paystack</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
