import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Booking } from "@/lib/apiTypes";

interface CalendarViewProps {
    bookings: Booking[];
    onBookingClick: (booking: Booking) => void;
}

export const CalendarView = ({ bookings, onBookingClick }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getBookingsForDate = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return bookings.filter(booking => {
            const bookingDate = new Date(booking.date).toISOString().split('T')[0];
            return bookingDate === dateStr;
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-500';
            case 'confirmed': return 'bg-green-500';
            case 'in_progress': return 'bg-blue-500';
            case 'completed': return 'bg-purple-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const renderCalendarDays = () => {
        const days = [];
        const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

        for (let i = 0; i < totalSlots; i++) {
            const day = i - firstDayOfMonth + 1;
            const isCurrentMonth = day > 0 && day <= daysInMonth;
            const dayBookings = isCurrentMonth ? getBookingsForDate(day) : [];
            const isToday = isCurrentMonth &&
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

            days.push(
                <div
                    key={i}
                    className={`min-h-[100px] p-2 border border-border ${isCurrentMonth ? 'bg-card' : 'bg-muted/30'
                        } ${isToday ? 'ring-2 ring-primary' : ''} rounded-lg hover:bg-muted/50 transition-colors`}
                >
                    {isCurrentMonth && (
                        <>
                            <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                                {day}
                            </div>
                            <div className="space-y-1">
                                {dayBookings.slice(0, 3).map(booking => (
                                    <button
                                        key={booking._id}
                                        onClick={() => onBookingClick(booking)}
                                        className="w-full text-left p-1.5 rounded-lg bg-gradient-card border border-border hover:shadow-soft transition-all group"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)} flex-shrink-0`}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                    {booking.time}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground truncate">
                                                    {typeof booking.service === 'object' ? booking.service.name : 'Service'}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                {dayBookings.length > 3 && (
                                    <div className="text-[10px] text-primary font-semibold text-center py-0.5">
                                        +{dayBookings.length - 3} more
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="bg-card rounded-3xl p-6 shadow-soft border border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {bookings.length} bookings this month
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={previousMonth}
                        className="w-10 h-10 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="w-10 h-10 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-muted-foreground">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-muted-foreground">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-muted-foreground">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-muted-foreground">Completed</span>
                </div>
            </div>
        </div>
    );
};
