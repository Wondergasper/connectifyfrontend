import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, Calendar, Clock, CheckCircle, CreditCard, AlertCircle, MapPin, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Service, User } from "@/lib/apiTypes";
import { useCreateBooking } from "@/hooks/useBookings";
import { useWalletBalance } from "@/hooks/useWallet";
import { useService } from "@/hooks/useServices";
import { toast } from "sonner";

const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateDaysFromToday = (days: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return formatDateInputValue(date);
};

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId") || "";
  const minBookingDate = getDateDaysFromToday(0);
  const maxBookingDate = getDateDaysFromToday(14);

  const { data: serviceRaw, isLoading: serviceLoading } = useService(serviceId);
  const serviceData = serviceRaw as Service | undefined;
  const provider = typeof serviceData?.provider === "object" ? serviceData.provider as User : undefined;

  const { data: walletData } = useWalletBalance();
  const walletBalance = walletData?.data?.balance ?? 0;
  const servicePrice = serviceData?.price || 0;
  const hasEnoughFunds = walletBalance >= servicePrice;

  const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
    queryKey: ["availability", { providerId: provider?._id, date: selectedDate }],
    queryFn: () => api.availability.get({
      providerId: provider?._id || "",
      date: selectedDate,
    }),
    enabled: !!provider?._id && !!selectedDate,
  });

  const times: string[] = availabilityData?.data?.slots?.map((slot: { startTime: string }) => slot.startTime) || [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00",
  ];

  const { mutate: createBooking, isPending } = useCreateBooking();

  const validateSelectedDate = (value: string) => {
    if (!value) return "Please select a valid date.";
    if (value < minBookingDate) return "Please choose today or a future date.";
    if (value > maxBookingDate) return "Bookings are available up to 2 weeks in advance.";
    return "";
  };

  const handleDateInput = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const nextDate = input.value;

    if (input.validity.badInput) {
      setSelectedDate("");
      setDateError("Please enter a real calendar date.");
      return;
    }

    setSelectedDate(nextDate);
    setDateError(nextDate ? validateSelectedDate(nextDate) : "");
  };

  const handleContinue = () => {
    if (step === 1) {
      const nextDateError = validateSelectedDate(selectedDate);
      setDateError(nextDateError);
      if (nextDateError) {
        toast.error(nextDateError);
        return;
      }
    }

    if (step === 2 && !selectedTime) {
      toast.error("Please select a time.");
      return;
    }

    setStep(step + 1);
  };

  const handleConfirm = () => {
    if (!serviceId || !serviceData) {
      toast.error("Please choose a service before booking.");
      navigate("/search");
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }
    if (!address.street.trim() || !address.city.trim() || !address.state.trim()) {
      toast.error("Please enter the service address.");
      return;
    }

    createBooking({
      service: serviceId,
      date: selectedDate,
      time: selectedTime,
      duration: serviceData.duration,
      totalAmount: servicePrice,
      notes: notes.trim(),
      address: {
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        country: address.country.trim() || "Nigeria",
      },
    }, {
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
      },
    });
  };

  if (!serviceId) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 md:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Search className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Choose a service first</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Booking needs a selected provider and service so the date, price, and address are attached correctly.
            </p>
            <Button onClick={() => navigate("/search")} className="mt-6 gradient-primary border-0">
              Browse services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-sm flex items-end md:items-center md:px-8 md:py-10">
      <div className="w-full max-w-[480px] md:max-w-5xl mx-auto bg-card rounded-t-3xl md:rounded-3xl shadow-strong animate-slide-up overflow-hidden">
        <div className="flex justify-center pt-3 pb-2 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-border" />
        </div>

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

        <div className="px-6 py-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
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
                    {provider?.name?.charAt(0) || "S"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{provider?.name || "Service Provider"}</h3>
                    <p className="text-sm text-muted-foreground">{serviceData?.name || serviceData?.category || "Service"}</p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      ₦{servicePrice.toLocaleString()}/{serviceData?.priceType === "hourly" ? "hr" : "service"}
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
                  onInput={handleDateInput}
                  onChange={handleDateInput}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                  min={minBookingDate}
                  max={maxBookingDate}
                  disabled={isPending}
                />
                {dateError && (
                  <p className="text-xs font-medium text-destructive">{dateError}</p>
                )}
              </div>

              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-xs text-muted-foreground text-center">Book up to 2 weeks in advance</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time
              </label>

              {availabilityLoading ? (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div key={idx} className="py-3 px-2 rounded-xl border border-border bg-card animate-pulse">
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
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

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-foreground">Custom Time</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                  disabled={isPending}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5 md:grid-cols-[1fr_1fr] animate-fade-in">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-card rounded-2xl border border-border space-y-3">
                  <h3 className="font-semibold text-foreground">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium text-foreground text-right">{serviceData?.name || serviceData?.category || "Service"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Provider</span>
                      <span className="font-medium text-foreground text-right">{provider?.name || "Service Provider"}</span>
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
                        <span className="text-xl font-bold text-primary">₦{servicePrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

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
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Service Address
                  </label>
                  <input
                    value={address.street}
                    onChange={(e) => setAddress((current) => ({ ...current, street: e.target.value }))}
                    placeholder="Street address"
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                    disabled={isPending}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={address.city}
                      onChange={(e) => setAddress((current) => ({ ...current, city: e.target.value }))}
                      placeholder="City"
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                      disabled={isPending}
                    />
                    <input
                      value={address.state}
                      onChange={(e) => setAddress((current) => ({ ...current, state: e.target.value }))}
                      placeholder="State"
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                      disabled={isPending}
                    />
                  </div>
                </div>

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

                {!hasEnoughFunds && (
                  <div className="p-4 bg-destructive/10 rounded-xl flex flex-col gap-3 sm:flex-row sm:items-start">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-destructive mb-1">Insufficient Wallet Balance</p>
                      <p className="text-xs text-destructive/80">
                        You need ₦{(servicePrice - walletBalance).toLocaleString()} more.
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate("/add-funds")} className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white">
                      Add funds
                    </Button>
                  </div>
                )}

                <div className="p-4 bg-accent/10 rounded-xl">
                  <p className="text-xs text-accent text-center">Secure payment. Money held until service is completed.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border space-y-2">
          {step < 3 ? (
            <Button
              onClick={handleContinue}
              disabled={serviceLoading || isPending}
              className="w-full h-14 gradient-primary border-0 font-semibold disabled:opacity-50"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={isPending || !hasEnoughFunds}
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
