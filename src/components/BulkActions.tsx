import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Booking } from "@/lib/apiTypes";

interface BulkActionsProps {
    selectedBookings: string[];
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onAcceptSelected: () => void;
    onRejectSelected: () => void;
    totalBookings: number;
}

export const BulkActions = ({
    selectedBookings,
    onSelectAll,
    onDeselectAll,
    onAcceptSelected,
    onRejectSelected,
    totalBookings
}: BulkActionsProps) => {
    const [showActions, setShowActions] = useState(false);
    const hasSelection = selectedBookings.length > 0;
    const allSelected = selectedBookings.length === totalBookings && totalBookings > 0;

    if (!hasSelection && !showActions) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
            <div className="bg-card rounded-2xl shadow-strong border-2 border-primary/20 px-6 py-4 flex items-center gap-4">
                {/* Selection Info */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={allSelected ? onDeselectAll : onSelectAll}
                        className="w-10 h-10 rounded-xl border-2 border-primary hover:bg-primary/10 flex items-center justify-center transition-all"
                    >
                        {allSelected ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                        ) : (
                            <Square className="w-5 h-5 text-muted-foreground" />
                        )}
                    </button>
                    <div>
                        <p className="text-sm font-bold text-foreground">
                            {selectedBookings.length} Selected
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {allSelected ? 'All bookings selected' : `${totalBookings - selectedBookings.length} remaining`}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-border"></div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        onClick={onAcceptSelected}
                        className="h-10 px-4 bg-green-500 hover:bg-green-600 border-0 text-white font-semibold rounded-xl shadow-sm"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                    </Button>
                    <Button
                        onClick={onRejectSelected}
                        variant="outline"
                        className="h-10 px-4 border-2 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30 font-semibold rounded-xl"
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                    </Button>
                    <Button
                        onClick={onDeselectAll}
                        variant="ghost"
                        className="h-10 px-4 text-muted-foreground hover:text-foreground rounded-xl"
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface BookingCheckboxProps {
    bookingId: string;
    isSelected: boolean;
    onToggle: (bookingId: string) => void;
}

export const BookingCheckbox = ({ bookingId, isSelected, onToggle }: BookingCheckboxProps) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onToggle(bookingId);
            }}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected
                    ? 'border-primary bg-primary'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
        >
            {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
        </button>
    );
};
