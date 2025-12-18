import { Button } from "@/components/ui/button";
import { Download, FileText, Printer, Share2, X } from "lucide-react";
import { Booking } from "@/lib/apiTypes";

interface ReceiptModalProps {
    booking: Booking;
    onClose: () => void;
}

export const ReceiptModal = ({ booking, onClose }: ReceiptModalProps) => {
    const handleDownloadPDF = () => {
        // In a real app, this would generate and download a PDF
        const element = document.getElementById('receipt-content');
        if (element) {
            window.print();
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Receipt #${booking._id.slice(-6).toUpperCase()}`,
                    text: `Booking receipt for ${typeof booking.service === 'object' ? booking.service.name : 'Service'}`,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-3xl shadow-strong max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Receipt</h2>
                            <p className="text-xs text-muted-foreground">
                                #{booking._id.slice(-6).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Receipt Content */}
                <div id="receipt-content" className="p-6 space-y-6">
                    {/* Company Info */}
                    <div className="text-center pb-6 border-b border-border">
                        <h3 className="text-2xl font-bold gradient-text mb-1">Connectify</h3>
                        <p className="text-sm text-muted-foreground">Professional Services Platform</p>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Service Provider</p>
                            <p className="font-semibold text-foreground">
                                {typeof booking.provider === 'object' ? booking.provider.name : 'Provider'}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Service</p>
                            <p className="font-semibold text-foreground">
                                {typeof booking.service === 'object' ? booking.service.name : 'Service'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Date</p>
                                <p className="font-medium text-foreground">{formatDate(booking.date)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Time</p>
                                <p className="font-medium text-foreground">{booking.time}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <div className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold uppercase ${booking.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                                    booking.status === 'cancelled' ? 'bg-red-500/10 text-red-600' :
                                        'bg-gray-500/10 text-gray-600'
                                }`}>
                                {booking.status}
                            </div>
                        </div>
                    </div>

                    {/* Amount Breakdown */}
                    <div className="space-y-3 pt-6 border-t border-border">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Service Fee</span>
                            <span className="font-medium text-foreground">₦{booking.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Platform Fee</span>
                            <span className="font-medium text-foreground">₦0</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-border">
                            <span className="font-bold text-foreground">Total Amount</span>
                            <span className="text-xl font-bold text-primary">₦{booking.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="p-4 bg-muted/30 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                        <p className="font-medium text-foreground">Connectify Wallet</p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Transaction Date: {formatDate(booking.createdAt || booking.date)}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                            Thank you for using Connectify!
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            For questions, contact support@connectify.com
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-border grid grid-cols-2 gap-3">
                    <Button
                        onClick={handleDownloadPDF}
                        className="h-12 gradient-primary border-0 font-semibold"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                    <Button
                        onClick={handleShare}
                        variant="outline"
                        className="h-12 border-2 font-semibold"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                </div>
            </div>
        </div>
    );
};
