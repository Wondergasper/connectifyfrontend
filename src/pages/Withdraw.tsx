import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Building, Send, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const Withdraw = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");

    const handleWithdraw = () => {
        if (!amount) {
            toast.error("Please enter an amount");
            return;
        }
        toast.success("Withdrawal initiated successfully!", {
            description: `₦${parseInt(amount).toLocaleString()} will be sent to your account.`
        });
        setTimeout(() => navigate(-1), 1500);
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
                    <h1 className="text-2xl font-bold text-white mb-2">Withdraw Funds</h1>
                    <p className="text-white/80 text-sm">Transfer earnings to your bank</p>
                </div>
            </div>

            <div className="px-6 -mt-16">
                <div className="bg-card rounded-3xl p-6 shadow-strong border border-border relative z-10">
                    <div className="space-y-8">
                        <div className="p-5 rounded-2xl bg-muted/30 border border-border text-center">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Available Balance</p>
                            <p className="text-3xl font-bold text-foreground">₦234,500</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center block">Amount to Withdraw</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold text-2xl">₦</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-10 text-3xl font-bold h-20 text-center bg-muted/30 border-border/50 focus:bg-background transition-smooth rounded-2xl"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Select Bank Account</label>
                                <button className="text-xs text-primary font-semibold hover:underline">
                                    + Add New
                                </button>
                            </div>

                            <button className="w-full flex items-center gap-4 p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-smooth group">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-smooth">
                                    <Building className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-foreground">GTBank •••• 1234</p>
                                    <p className="text-xs text-muted-foreground">Chioma Nwosu</p>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                </div>
                            </button>
                        </div>

                        <Button
                            onClick={handleWithdraw}
                            className="w-full gradient-primary border-0 h-14 text-lg font-semibold shadow-medium hover:shadow-strong transition-all hover:scale-[1.02] rounded-xl"
                        >
                            <Send className="w-5 h-5 mr-2" />
                            Withdraw Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Withdraw;
