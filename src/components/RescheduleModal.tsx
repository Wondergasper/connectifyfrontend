import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Calendar, Clock, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface RescheduleModalProps {
    bookingId: string;
    currentDate: string;
    currentTime: string;
    providerId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const RescheduleModal = ({
    bookingId,
    currentDate,
    currentTime,
    providerId,
    onClose,
    onSuccess
}: RescheduleModalProps) => {
    const [newDate, setNewDate] = useState(currentDate);
    const [newTime, setNewTime] = useState(currentTime);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch availability for new date
    const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
        queryKey: ['availability', { providerId, date: newDate }],
        queryFn: () => api.availability.get({
            providerId: providerId,
            date: newDate
        }),
        enabled: !!providerId && !!newDate && newDate !== currentDate
    });

    const times = availabilityData?.slots?.map((slot: { startTime: string }) => slot.startTime) || [
        "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00",
        "17:00", "18:00"
    ];

    const handleSubmit = async () => {
        if (!newDate || !newTime) {
            return;
        }

        setIsSubmitting(true);
        try {
            await api.bookings.update(bookingId, {
                date: newDate,
                time: newTime,
                notes: reason ? `Reschedule reason: ${reason}` : undefined
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to reschedule:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-3xl shadow-strong max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Reschedule Booking</h2>
                        <p className="text-sm text-muted-foreground">Choose a new date and time</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Current Booking */}
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Current Booking</p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="font-medium">{new Date(currentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="font-medium">{currentTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* New Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            New Date
                        </label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* New Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            New Time
                        </label>

                        {availabilityLoading && newDate !== currentDate ? (
                            <div className="grid grid-cols-3 gap-2">
                                {[...Array(6)].map((_, idx) => (
                                    <div key={idx} className="py-3 px-2 rounded-xl border border-border bg-card animate-pulse">
                                        <div className="h-4 bg-muted rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {times.map((time, idx) => (
                                    <button
                                        key={time || idx}
                                        type="button"
                                        onClick={() => setNewTime(time)}
                                        className={`py-3 px-2 rounded-xl border-2 transition-smooth text-sm font-medium ${newTime === time
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-border bg-card text-foreground hover:border-muted-foreground/30"
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reason (Optional) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Reason (Optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Let the provider know why you need to reschedule..."
                            className="w-full h-24 p-4 rounded-xl border border-border bg-background text-foreground resize-none"
                        />
                    </div>

                    {/* Warning */}
                    <div className="p-4 bg-amber-500/10 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-amber-600 mb-1">Reschedule Request</p>
                            <p className="text-xs text-amber-600/80">
                                The provider will be notified of your reschedule request. The booking status will be updated.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-border space-y-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !newDate || !newTime || (newDate === currentDate && newTime === currentTime)}
                        className="w-full h-14 gradient-primary border-0 font-semibold disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Rescheduling...
                            </>
                        ) : (
                            'Confirm Reschedule'
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};
