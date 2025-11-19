import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, MessageSquare, User, CheckCircle, XCircle, FileText, Shield, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";

const BookingDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const role = location.state?.role || "provider"; // Default to provider if not specified, or handle gracefully

    // Mock data - in a real app, fetch based on ID
    const booking = {
        id: id,
        name: role === "customer" ? "Chioma Nwosu" : "Adebayo Williams", // Display Provider name for customer, Customer name for provider
        title: role === "customer" ? "Service Provider" : "Customer",
        service: "House Cleaning",
        status: "confirmed",
        date: "Dec 15, 2024",
        time: "2:00 PM",
        duration: "3 hours",
        location: "Lekki Phase 1, Lagos",
        address: "Block 4, Flat 2, Admiralty Way",
        price: "₦15,000",
        paymentStatus: "Paid",
        notes: "Please bring your own cleaning supplies. Key is under the mat.",
        phone: "+234 812 345 6789"
    };

    const handleAccept = () => {
        toast.success("Booking accepted successfully!");
        navigate(-1);
    };

    const handleDecline = () => {
        toast.error("Booking declined.");
        navigate(-1);
    };

    const handleReschedule = () => {
        toast.info("Reschedule request sent.");
    };

    const handleCancel = () => {
        toast.error("Booking cancelled.");
        navigate(-1);
    };

    const handleChat = () => {
        navigate("/messages");
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="gradient-primary px-6 pt-12 pb-24 rounded-b-[3rem] relative overflow-hidden shadow-strong">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>

                <div className="text-center text-white">
                    <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-4 shadow-strong">
                        <User className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-1 drop-shadow-md">{booking.name}</h1>
                    <p className="text-white/80 font-medium text-lg">{booking.service}</p>

                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm">
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span className="text-sm font-semibold tracking-wide uppercase">{booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}</span>
                    </div>
                </div>
            </div>

            {/* Floating Content Card */}
            <div className="px-6 -mt-16 relative z-10 space-y-6">
                {/* Service Details */}
                <div className="bg-card rounded-3xl p-6 shadow-strong border border-border space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                        <h3 className="font-bold text-foreground text-lg">Service Details</h3>
                        <span className="text-primary font-bold text-xl">{booking.price}</span>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-0.5">Date</p>
                                <p className="font-bold text-foreground">{booking.date}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-0.5">Time</p>
                                <p className="font-bold text-foreground">{booking.time} <span className="text-muted-foreground font-normal">({booking.duration})</span></p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-0.5">Location</p>
                                <p className="font-bold text-foreground mb-1">{booking.location}</p>
                                <p className="text-xs text-muted-foreground">{booking.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes (Conditional) */}
                <div className="bg-card rounded-3xl p-6 shadow-soft border border-border">
                    <h3 className="font-bold text-foreground mb-3">
                        {role === "customer" ? "My Notes" : "Customer Notes"}
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                            "{booking.notes}"
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                    <Button
                        onClick={handleChat}
                        className="w-full h-14 rounded-xl bg-card border-2 border-primary/10 hover:bg-primary/5 text-foreground font-bold shadow-sm group"
                    >
                        <MessageSquare className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                        Message {role === "customer" ? "Provider" : "Customer"}
                    </Button>

                    {role === "provider" ? (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleDecline}
                                variant="outline"
                                className="h-14 rounded-xl border-2 border-destructive/10 text-destructive hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 font-bold"
                            >
                                <XCircle className="w-5 h-5 mr-2" />
                                Decline
                            </Button>
                            <Button
                                onClick={handleAccept}
                                className="h-14 rounded-xl gradient-primary border-0 font-bold shadow-medium hover:shadow-strong hover:scale-[1.02] transition-all"
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Accept Job
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="h-14 rounded-xl border-2 border-destructive/10 text-destructive hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 font-bold"
                            >
                                <XCircle className="w-5 h-5 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleReschedule}
                                className="h-14 rounded-xl bg-primary/10 text-primary border-0 font-bold hover:bg-primary/20 transition-all"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Reschedule
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;
