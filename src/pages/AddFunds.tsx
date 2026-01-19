import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, ShieldCheck, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { useAddFunds } from "@/hooks/useWallet";

const AddFunds = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const { mutate: addFunds, isPending } = useAddFunds();

    const handleProceed = () => {
        if (!amount) {
            toast.error("Please enter an amount");
            return;
        }

        // Validate amount
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        // Process the fund addition
        addFunds(
            { amount: amountValue, paymentMethod: 'paystack' },
            {
                onSuccess: () => {
                    toast.success("Funds added successfully!");
                    navigate("/customer");
                },
                onError: (error: Error) => {
                    console.error("Failed to add funds:", error);
                    toast.error(error.message || "Failed to add funds. Please try again.");
                }
            }
        );
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="gradient-primary px-6 pt-12 pb-20 rounded-b-[3rem] relative overflow-hidden shadow-strong">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Add Funds</h1>
                    <p className="text-white/80 text-sm">Top up your wallet securely</p>
                </div>
            </div>

            <div className="px-6 -mt-16">
                <div className="bg-card rounded-3xl p-6 shadow-strong border border-border relative z-10">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center block">Enter Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold text-2xl">₦</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-10 text-3xl font-bold h-20 text-center bg-muted/30 border-border/50 focus:bg-background transition-smooth rounded-2xl"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {["1000", "5000", "10000"].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val)}
                                    disabled={isPending}
                                    className={`py-3 rounded-xl border border-border text-sm font-medium transition-smooth ${
                                        amount === val
                                          ? 'bg-primary/10 border-primary text-primary'
                                          : 'bg-muted/20 hover:bg-primary/5 hover:border-primary/30'
                                    }`}
                                >
                                    ₦{parseInt(val).toLocaleString()}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment Method</label>
                            <button
                                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-smooth group"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent from navigating since payment will happen on click
                                    handleProceed();
                                }}
                                disabled={isPending}
                            >
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-smooth">
                                    <CreditCard className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-foreground">Paystack</p>
                                    <p className="text-xs text-muted-foreground">Cards, Bank Transfer, USSD</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                        </div>

                        <Button
                            onClick={handleProceed}
                            disabled={isPending || !amount}
                            className="w-full gradient-primary border-0 h-14 text-lg font-semibold shadow-medium hover:shadow-strong transition-all hover:scale-[1.02] rounded-xl"
                        >
                            {isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Processing...
                                </>
                            ) : (
                                "Proceed to Pay"
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground opacity-70">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Secured by Paystack</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFunds;
