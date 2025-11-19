import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Plus, Trash2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ManageCards = () => {
    const navigate = useNavigate();

    const handleAddCard = () => {
        toast.info("Redirecting to secure card setup...");
    };

    const handleDelete = () => {
        toast.success("Card removed successfully");
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
                    <h1 className="text-2xl font-bold text-white mb-2">Manage Cards</h1>
                    <p className="text-white/80 text-sm">Your saved payment methods</p>
                </div>
            </div>

            <div className="px-6 -mt-16">
                <div className="space-y-6">
                    {/* Saved Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-strong border border-white/10 relative overflow-hidden group text-white">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-12 h-8 rounded bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-[10px] tracking-wider border border-white/20">
                                    VISA
                                </div>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-smooth backdrop-blur-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="font-mono text-xl tracking-widest text-white/90">•••• •••• •••• 4242</p>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Card Holder</p>
                                    <p className="font-medium text-sm">Samuel Adeyemi</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Expires</p>
                                    <p className="font-medium text-sm">12/25</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add New Card */}
                    <button
                        onClick={handleAddCard}
                        className="w-full py-5 rounded-3xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-smooth flex items-center justify-center gap-2 text-muted-foreground hover:text-primary font-medium group bg-card"
                    >
                        <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                            <Plus className="w-4 h-4" />
                        </div>
                        Add New Card
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground opacity-70 pt-4">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Payments secured by Paystack</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCards;
