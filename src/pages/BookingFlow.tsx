import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, Calendar, Clock, CheckCircle, CreditCard, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Service } from "@/lib/apiTypes";
import { useCreateBooking } from "@/hooks/useBookings";
import { useWalletBalance } from "@/hooks/useWallet";
import { useService } from "@/hooks/useServices";
import { toast } from "sonner";

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId') || '';

  // Fetch service data — cast explicitly to Service to avoid ApiResponse union TS errors
  const { data: serviceRaw, isLoading: serviceLoading } = useService(serviceId);
  const serviceData = serviceRaw as Service | undefined;
  // provider is typed as string | User in the schema — cast to any for JSX access
  const provider = (serviceData?.provider as any);

  // Fetch wallet balance
  const { data: walletData } = useWalletBalance();
  const walletBalance = (walletData as any)?.balance ?? (walletData as any)?.data?.balance ?? 0;

  // Fetch availability based on the provider and selected date
  const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
    queryKey: ['availability', { providerId: provider?._id, date: selectedDate }],
    queryFn: () => api.availability.get({
      providerId: provider?._id || '',
      date: selectedDate
    }),
    enabled: !!provider?._id && !!selectedDate
  });

  // Use availability slots if available, otherwise fall back to hourly time options
  const times: string[] = availabilityData?.data?.slots?.map((slot: { startTime: string }) => slot.startTime) || [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00"
  ];

  const { mutate: createBooking, isPending } = useCreateBooking();

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    const bookingData = {
      service: serviceId,
      date: selectedDate,
      time: selectedTime,
      duration: serviceData?.duration,
      totalAmount: serviceData?.price || 0,
      notes: notes || "",
      address: (serviceData as any)?.location || {}
    };

    createBooking(bookingData, {
      onSuccess: (response) => {
        toast.success("Booking created successfully!");
        if (response.booking?._id) {
          navigate(`/booking/${response.booking._id}`, { state: { role: "customer" } });
        } else {
          navigate("/bookings");
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to create booking. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-sm flex items-end">
      {/* Bottom Sheet */}
      <div className="w-full max-w-[480px] mx-auto bg-card rounded-t-3xl shadow-strong animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Book Service</h2>
            <p className="text-sm text-muted-foreground">Step {step} of 3</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-smooth ${i <= step ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1 — Date Selection */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              {serviceLoading ? (
                <div className="flex items-start gap-4 p-4 bg-gradient-card rounded-2xl border border-border animate-pulse">
                  <div className="w-16 h-16 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4 p-4 bg-gradient-card rounded-2xl border border-border">
                  <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-3xl text-white font-bold">
                    {provider?.name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{provider?.name || 'Service Provider'}</h3>
                    <p className="text-sm text-muted-foreground">{serviceData?.name || serviceData?.category || 'Service'}</p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      ₦{(serviceData?.price || 0).toLocaleString()}/{serviceData?.priceType === 'hourly' ? 'hr' : 'service'}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isPending}
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-xs text-muted-foreground text-center">📅 Book up to 2 weeks in advance</p>
              </div>
            </div>
          )}

          {/* Step 2 — Time Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time
              </label>

              {availabilityLoading ? (
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="py-3 px-2 rounded-xl border border-border bg-card animate-pulse">
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {times.map((time, idx) => (
                    <button
                      key={time || idx}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 rounded-xl border-2 transition-smooth text-sm font-medium ${
                        selectedTime === time
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-foreground hover:border-muted-foreground/30"
                      }`}
                      disabled={isPending}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Confirm & Pay */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              {/* Summary */}
              <div className="p-4 bg-gradient-card rounded-2xl border border-border space-y-3">
                <h3 className="font-semibold text-foreground">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">{serviceData?.name || serviceData?.category || 'Service'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider</span>
                    <span className="font-medium text-foreground">{provider?.name || 'Service Provider'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{selectedDate || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedTime || "Not selected"}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">₦{(serviceData?.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for the provider..."
                  className="w-full h-24 p-4 rounded-xl border border-border bg-background text-foreground resize-none"
                  disabled={isPending}
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </label>
                <button className="w-full p-4 rounded-xl border-2 border-primary bg-primary/5 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold">W</div>
                      <div>
                        <div className="font-medium text-foreground text-sm">Connectify Wallet</div>
                        <div className="text-xs text-muted-foreground">Balance: ₦{walletBalance.toLocaleString()}</div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-primary" fill="currentColor" />
                  </div>
                </button>
              </div>

              {/* Insufficient Funds Warning */}
              {walletBalance < (serviceData?.price || 0) && (
                <div className="p-4 bg-destructive/10 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-destructive mb-1">Insufficient Wallet Balance</p>
                    <p className="text-xs text-destructive/80">
                      You need ₦{((serviceData?.price || 0) - walletBalance).toLocaleString()} more. Please add funds.
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-xs text-accent text-center">🔒 Secure payment. Money held until service is completed.</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border space-y-2">
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !selectedDate : !selectedTime || isPending}
              className="w-full h-14 gradient-primary border-0 font-semibold disabled:opacity-50"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={isPending || walletBalance < (serviceData?.price || 0)}
              className="w-full h-14 gradient-primary border-0 font-semibold"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm & Pay
                </>
              )}
            </Button>
          )}

          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="w-full" disabled={isPending}>
              Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
