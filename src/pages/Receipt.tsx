import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Receipt = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleDownload = () => {
        toast.success("Receipt downloaded successfully");
    };

    const handleShare = () => {
        toast.success("Receipt shared");
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="gradient-primary px-6 pt-12 pb-24 rounded-b-[3rem] relative overflow-hidden shadow-strong">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="text-center text-white">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-4 shadow-strong">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-1">Payment Successful</h1>
                    <p className="text-white/80">Transaction ID: #TRX-{id}</p>
                </div>
            </div>

            <div className="px-6 -mt-16 relative z-10">
                <div className="bg-card rounded-3xl p-6 shadow-strong border border-border space-y-6">
                    <div className="text-center border-b border-border/50 pb-6">
                        <p className="text-sm text-muted-foreground mb-1">Total Amount Paid</p>
                        <h2 className="text-4xl font-bold text-primary">₦15,000.00</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium text-foreground">Dec 15, 2024, 2:00 PM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Service</span>
                            <span className="font-medium text-foreground">House Cleaning</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Provider</span>
                            <span className="font-medium text-foreground">Chioma Nwosu</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-medium text-foreground">Visa ending in 4242</span>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            onClick={handleDownload}
                            className="flex-1 h-12 rounded-xl gradient-primary border-0 font-semibold shadow-sm"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button
                            onClick={handleShare}
                            variant="outline"
                            className="flex-1 h-12 rounded-xl border-2 border-muted hover:bg-muted/50 font-semibold"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Receipt;
