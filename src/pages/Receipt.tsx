import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const Receipt = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch booking details to get receipt information
    const { data: bookingData, isLoading, isError } = useQuery({
        queryKey: ['booking', id],
        queryFn: () => api.bookings.getById(id!),
    });

    // Function to download receipt as PDF
    const handleDownload = async () => {
        try {
            // In a real app, this would call the actual PDF endpoint
            // For now, we'll simulate the download
            window.open(`/api/receipts/${id}/pdf`, '_blank');
            toast.success("Receipt downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download receipt. Please try again.");
        }
    };

    const handleShare = () => {
        navigator.share({
            title: 'Booking Receipt',
            text: `Receipt for booking ${id}`,
            url: window.location.href
        }).catch(() => {
            // Fallback if web share API is not supported
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Loading receipt...</p>
                </div>
            </div>
        );
    }

    if (isError || !bookingData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Receipt</h2>
                    <p className="text-muted-foreground mb-4">Failed to load receipt details. Please try again later.</p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    const booking = bookingData;

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
                    <p className="text-white/80">Transaction ID: #{booking._id || id}</p>
                </div>
            </div>

            <div className="px-6 -mt-16 relative z-10">
                <div className="bg-card rounded-3xl p-6 shadow-strong border border-border space-y-6">
                    <div className="text-center border-b border-border/50 pb-6">
                        <p className="text-sm text-muted-foreground mb-1">Total Amount Paid</p>
                        <h2 className="text-4xl font-bold text-primary">₦{(booking.totalAmount || 0).toLocaleString()}</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium text-foreground">{new Date(booking.createdAt || booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Service</span>
                            <span className="font-medium text-foreground">{booking.service?.name || booking.serviceName || 'Service'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Provider</span>
                            <span className="font-medium text-foreground">{booking.provider?.name || 'Service Provider'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Customer</span>
                            <span className="font-medium text-foreground">{booking.customer?.name || 'Customer'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <span className={`font-medium ${
                                booking.status === 'completed' ? 'text-green-500' :
                                booking.status === 'confirmed' ? 'text-blue-500' :
                                'text-foreground'
                            }`}>
                                {booking.status?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            onClick={handleDownload}
                            className="flex-1 h-12 rounded-xl gradient-primary border-0 font-semibold shadow-sm"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
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
