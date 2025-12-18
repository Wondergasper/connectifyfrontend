import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Filter, Calendar, DollarSign, User } from "lucide-react";

interface BookingFiltersProps {
    onApplyFilters: (filters: FilterOptions) => void;
    onClose: () => void;
}

export interface FilterOptions {
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
    status?: string[];
    serviceType?: string;
}

export const BookingFilters = ({ onApplyFilters, onClose }: BookingFiltersProps) => {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [serviceType, setServiceType] = useState("");

    const statuses = [
        { value: "pending", label: "Pending", color: "amber" },
        { value: "confirmed", label: "Confirmed", color: "green" },
        { value: "in_progress", label: "In Progress", color: "blue" },
        { value: "completed", label: "Completed", color: "purple" },
        { value: "cancelled", label: "Cancelled", color: "red" },
        { value: "rejected", label: "Rejected", color: "gray" }
    ];

    const toggleStatus = (status: string) => {
        setSelectedStatuses(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const handleApply = () => {
        const filters: FilterOptions = {
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            minAmount: minAmount ? parseFloat(minAmount) : undefined,
            maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
            status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
            serviceType: serviceType || undefined
        };
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        setDateFrom("");
        setDateTo("");
        setMinAmount("");
        setMaxAmount("");
        setSelectedStatuses([]);
        setServiceType("");
        onApplyFilters({});
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-card rounded-t-3xl sm:rounded-3xl shadow-strong max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Filter className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Filter Bookings</h2>
                            <p className="text-xs text-muted-foreground">Refine your search</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Date Range */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Date Range
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">From</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-foreground text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">To</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-foreground text-sm"
                                    min={dateFrom}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amount Range */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            Amount Range (₦)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                                <input
                                    type="number"
                                    value={minAmount}
                                    onChange={(e) => setMinAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-foreground text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                                <input
                                    type="number"
                                    value={maxAmount}
                                    onChange={(e) => setMaxAmount(e.target.value)}
                                    placeholder="Any"
                                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-foreground text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground">Status</label>
                        <div className="flex flex-wrap gap-2">
                            {statuses.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => toggleStatus(status.value)}
                                    className={`px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${selectedStatuses.includes(status.value)
                                            ? `border-${status.color}-500 bg-${status.color}-500/10 text-${status.color}-600`
                                            : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                                        }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Service Type */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Service Type
                        </label>
                        <input
                            type="text"
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            placeholder="e.g. Plumbing, Cleaning..."
                            className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-border space-y-2 sticky bottom-0 bg-card">
                    <Button
                        onClick={handleApply}
                        className="w-full h-12 gradient-primary border-0 font-semibold shadow-medium hover:shadow-strong transition-all"
                    >
                        Apply Filters
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="w-full h-11 text-muted-foreground hover:text-foreground"
                    >
                        Reset All
                    </Button>
                </div>
            </div>
        </div>
    );
};
