import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, MessageSquare, User, CheckCircle, XCircle, FileText, Shield, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useBooking } from "@/hooks/useBookings";
import { useUpdateBooking } from "@/hooks/useBookings";
import { RescheduleModal } from "@/components/RescheduleModal";
import { useState } from "react";

const BookingDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const role = location.state?.role || "provider"; // Default to provider if not specified, or handle gracefully

    // Fetch booking details from API
    const { data: bookingData, isLoading, isError } = useBooking(id!);

    // Mutation to update booking status
    const { mutate: updateBooking, isPending } = useUpdateBooking(id!);

    // Reschedule modal state
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (isError || !bookingData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Booking</h2>
                    <p className="text-muted-foreground mb-4">Failed to load booking details. Please try again later.</p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    const booking = bookingData;

    const handleAccept = () => {
        updateBooking({ status: 'confirmed' }, {
            onSuccess: () => {
                toast.success("Booking accepted successfully!");
                navigate(-1);
            },
            onError: (error: Error) => {
                console.error("Failed to accept booking:", error);
                toast.error(error.message || "Failed to accept booking. Please try again.");
            }
        });
    };

    const handleDecline = () => {
        updateBooking({ status: 'rejected' }, {
            onSuccess: () => {
                toast.error("Booking declined.");
                navigate(-1);
            },
            onError: (error: Error) => {
                console.error("Failed to decline booking:", error);
                toast.error(error.message || "Failed to decline booking. Please try again.");
            }
        });
    };

    const handleReschedule = () => {
        setShowRescheduleModal(true);
    };

    const handleCancel = () => {
        updateBooking({ status: 'cancelled' }, {
            onSuccess: () => {
                toast.error("Booking cancelled.");
                navigate(-1);
            },
            onError: (error: Error) => {
                console.error("Failed to cancel booking:", error);
                toast.error(error.message || "Failed to cancel booking. Please try again.");
            }
        });
    };

    const handleChat = () => {
        navigate("/messages");
    };

    const handleStartService = () => {
        updateBooking({ status: 'in_progress' }, {
            onSuccess: () => {
                toast.success("Service started!");
            },
            onError: (error: Error) => {
                console.error("Failed to start service:", error);
                toast.error(error.message || "Failed to start service.");
            }
        });
    };

    const handleMarkComplete = () => {
        updateBooking({ status: 'completed', completedAt: new Date() }, {
            onSuccess: () => {
                toast.success("Booking marked as complete!");
                navigate(-1);
            },
            onError: (error: Error) => {
                console.error("Failed to complete booking:", error);
                toast.error(error.message || "Failed to mark as complete.");
            }
        });
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
                    <h1 className="text-3xl font-bold mb-1 drop-shadow-md">{booking.customer?.name || booking.provider?.name || 'Service Provider'}</h1>
                    <p className="text-white/80 font-medium text-lg">{booking.service?.name || booking.serviceName || 'Service'}</p>

                    <div className={`inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/30 shadow-sm ${booking.status === 'pending' ? 'bg-amber-500/20 text-amber-200' :
                        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-200' :
                            booking.status === 'in_progress' ? 'bg-blue-500/20 text-blue-200' :
                                booking.status === 'completed' ? 'bg-purple-500/20 text-purple-200' :
                                    booking.status === 'cancelled' ? 'bg-red-500/20 text-red-200' :
                                        'bg-gray-500/20 text-gray-200'
                        }`}>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold tracking-wide uppercase">{booking.status?.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            {/* Floating Content Card */}
            <div className="px-6 -mt-16 relative z-10 space-y-6">
                {/* Service Details */}
                <div className="bg-card rounded-3xl p-6 shadow-strong border border-border space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                        <h3 className="font-bold text-foreground text-lg">Service Details</h3>
                        <span className="text-primary font-bold text-xl">₦{booking.totalAmount?.toLocaleString() || '0'}</span>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-0.5">Date</p>
                                <p className="font-bold text-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-0.5">Time</p>
                                <p className="font-bold text-foreground">{booking.time} <span className="text-muted-foreground font-normal">({booking.duration || 'N/A'} min)</span></p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-0.5">Location</p>
                                <p className="font-bold text-foreground mb-1">{booking.address?.location || booking.address?.street || 'Address not specified'}</p>
                                <p className="text-xs text-muted-foreground">{booking.address?.city || booking.address?.state ? `${booking.address?.city || ''}, ${booking.address?.state || ''}` : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes (Conditional) */}
                <div className="bg-card rounded-3xl p-6 shadow-soft border border-border">
                    <h3 className="font-bold text-foreground mb-3">
                        {role === "customer" ? "Customer Notes" : "Provider Notes"}
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                            "{booking.notes || 'No special instructions provided'}"
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                    <Button
                        onClick={handleChat}
                        className="w-full h-14 rounded-xl bg-card border-2 border-primary/10 hover:bg-primary/5 text-foreground font-bold shadow-sm group"
                        disabled={isPending}
                    >
                        <MessageSquare className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                        Message {role === "customer" ? "Provider" : "Customer"}
                    </Button>

                    {role === "provider" ? (
                        <>
                            {/* Only show Accept/Decline for pending bookings */}
                            {booking.status === 'pending' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={handleDecline}
                                        variant="outline"
                                        className="h-14 rounded-xl border-2 border-destructive/10 text-destructive hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 font-bold"
                                        disabled={isPending}
                                    >
                                        <XCircle className="w-5 h-5 mr-2" />
                                        Decline
                                    </Button>
                                    <Button
                                        onClick={handleAccept}
                                        className="h-14 rounded-xl gradient-primary border-0 font-bold shadow-medium hover:shadow-strong hover:scale-[1.02] transition-all"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Accept Job
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Start Service for confirmed bookings */}
                            {booking.status === 'confirmed' && (
                                <Button
                                    onClick={handleStartService}
                                    className="w-full h-14 rounded-xl gradient-primary border-0 font-bold shadow-medium hover:shadow-strong hover:scale-[1.02] transition-all"
                                    disabled={isPending}
                                >
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Start Service
                                </Button>
                            )}

                            {/* Mark Complete for in-progress bookings */}
                            {booking.status === 'in_progress' && (
                                <Button
                                    onClick={handleMarkComplete}
                                    className="w-full h-14 rounded-xl gradient-primary border-0 font-bold shadow-medium hover:shadow-strong hover:scale-[1.02] transition-all"
                                    disabled={isPending}
                                >
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Mark Complete
                                </Button>
                            )}
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="h-14 rounded-xl border-2 border-destructive/10 text-destructive hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 font-bold"
                                disabled={isPending}
                            >
                                <XCircle className="w-5 h-5 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleReschedule}
                                className="h-14 rounded-xl bg-primary/10 text-primary border-0 font-bold hover:bg-primary/20 transition-all"
                                disabled={isPending}
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Reschedule
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Reschedule Modal */ }
    {
        showRescheduleModal && booking && (
            <RescheduleModal
                bookingId={booking._id}
                currentDate={booking.date}
                currentTime={booking.time}
                providerId={booking.provider?._id || ''}
                onClose={() => setShowRescheduleModal(false)}
                onSuccess={() => {
                    toast.success('Booking rescheduled successfully!');
                    setShowRescheduleModal(false);
                }}
            />
        )
    }
    </div >
    );
};

export default BookingDetail;
