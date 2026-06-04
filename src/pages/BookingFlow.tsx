import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, Calendar, Clock, CheckCircle, CreditCard, AlertCircle, MapPin, Search, ChevronLeft, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Service, User } from "@/lib/apiTypes";
import { useCreateBooking } from "@/hooks/useBookings";
import { useWalletBalance } from "@/hooks/useWallet";
import { useService } from "@/hooks/useServices";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
        const bookingId = response?.booking?._id ?? response?.data?.booking?._id;
        if (bookingId) {
          navigate(`/booking/${bookingId}`, { state: { role: "customer" } });
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full rounded-3xl border border-border bg-card p-8 text-center shadow-strong"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
              <Search className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Choose a service first</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Booking needs a selected provider and service so the date, price, and address are attached correctly.
            </p>
            <Button onClick={() => navigate("/search")} className="mt-8 h-12 px-8 gradient-primary border-0 shadow-glow">
              Browse services
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-md flex items-end md:items-center md:px-8 md:py-10">
      <motion.div 
        layout
        className="w-full max-w-[540px] md:max-w-4xl mx-auto bg-card rounded-t-[2.5rem] md:rounded-[2rem] shadow-strong overflow-hidden relative"
      >
        <div className="flex justify-center pt-3 pb-2 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-smooth"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-foreground leading-none">
                {step === 1 ? "Schedule" : step === 2 ? "Select Time" : "Finalize"}
              </h2>
              <p className="text-xs font-medium text-muted-foreground mt-1 tracking-wide uppercase">
                Step {step} of 3
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-smooth"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 pt-6 pb-2">
          <div className="flex gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-8 max-h-[65vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                {/* Service Card */}
                {serviceLoading ? (
                  <div className="flex items-start gap-4 p-5 bg-muted/30 rounded-3xl border border-border animate-pulse">
                    <div className="w-20 h-20 rounded-2xl bg-muted" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-6 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-5 p-5 bg-accent/5 rounded-3xl border border-border shadow-soft">
                    <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl text-white font-bold shadow-medium">
                      {provider?.name?.charAt(0) || "S"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground leading-tight">{provider?.name || "Service Provider"}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{serviceData?.name || serviceData?.category || "Service"}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-primary">₦{servicePrice.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase font-bold">
                          {serviceData?.priceType === "hourly" ? "per hour" : "fixed"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Picker */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-primary" />
                    Preferred Date
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="date"
                      value={selectedDate}
                      onInput={handleDateInput}
                      onChange={handleDateInput}
                      className={`w-full h-14 pl-12 pr-4 rounded-2xl border-2 transition-all outline-none bg-background text-foreground font-medium ${
                        dateError ? "border-destructive/50 focus:border-destructive" : "border-border focus:border-primary shadow-soft"
                      }`}
                      min={minBookingDate}
                      max={maxBookingDate}
                      disabled={isPending}
                    />
                  </div>
                  {dateError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-bold text-destructive px-1"
                    >
                      {dateError}
                    </motion.p>
                  )}
                </div>

                <div className="p-4 bg-muted/40 rounded-2xl flex gap-3 items-center">
                  <Info className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-tight">
                    You can schedule services up to 14 days in advance. Rescheduling is free up to 24 hours before the appointment.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-primary" />
                    Available Time Slots
                  </label>
                  <span className="text-xs text-muted-foreground">{selectedDate}</span>
                </div>

                {availabilityLoading ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div key={idx} className="h-12 rounded-2xl border border-border bg-muted/20 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {times.map((time, idx) => (
                      <button
                        key={time || idx}
                        onClick={() => setSelectedTime(time)}
                        className={`h-12 rounded-2xl border-2 font-bold text-sm transition-all active:scale-95 ${
                          selectedTime === time
                            ? "border-primary bg-primary text-white shadow-glow"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                        disabled={isPending}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-border/50">
                  <label className="text-sm font-bold text-foreground uppercase tracking-wider">Or enter custom time</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-border focus:border-primary outline-none bg-background text-foreground font-medium shadow-soft transition-all"
                      disabled={isPending}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid gap-8 md:grid-cols-2"
              >
                {/* Invoice-style Summary */}
                <div className="space-y-6">
                  <div className="bg-muted/30 rounded-[2rem] border border-border p-6 shadow-soft relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12" />
                    <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Booking Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-sm text-muted-foreground">Service</span>
                        <span className="text-sm font-bold text-foreground text-right">{serviceData?.name || "Professional Service"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Schedule</span>
                        <span className="text-sm font-bold text-foreground">{selectedDate} at {selectedTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="text-sm font-bold text-foreground">~{serviceData?.duration || 60} mins</span>
                      </div>
                      <div className="pt-4 mt-2 border-t border-border/50 flex justify-between items-center">
                        <span className="font-bold text-foreground">Total Payable</span>
                        <span className="text-2xl font-black text-primary">₦{servicePrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-foreground uppercase tracking-widest px-1">Additional Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Please bring a ladder, Gate code is 1234..."
                      className="w-full h-28 p-4 rounded-2xl border-2 border-border focus:border-primary outline-none bg-background text-foreground resize-none text-sm transition-all"
                      disabled={isPending}
                    />
                  </div>
                </div>

                {/* Address & Payment */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2 px-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      Service Address
                    </label>
                    <div className="space-y-3">
                      <input
                        value={address.street}
                        onChange={(e) => setAddress((current) => ({ ...current, street: e.target.value }))}
                        placeholder="Street address & Building name"
                        className="w-full h-12 px-4 rounded-xl border-2 border-border focus:border-primary outline-none bg-background text-foreground text-sm transition-all shadow-soft"
                        disabled={isPending}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={address.city}
                          onChange={(e) => setAddress((current) => ({ ...current, city: e.target.value }))}
                          placeholder="City"
                          className="w-full h-12 px-4 rounded-xl border-2 border-border focus:border-primary outline-none bg-background text-foreground text-sm transition-all shadow-soft"
                          disabled={isPending}
                        />
                        <input
                          value={address.state}
                          onChange={(e) => setAddress((current) => ({ ...current, state: e.target.value }))}
                          placeholder="State"
                          className="w-full h-12 px-4 rounded-xl border-2 border-border focus:border-primary outline-none bg-background text-foreground text-sm transition-all shadow-soft"
                          disabled={isPending}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2 px-1">
                      <CreditCard className="w-4 h-4 text-primary" />
                      Payment Method
                    </label>
                    <div className={`p-4 rounded-2xl border-2 shadow-soft transition-all ${
                      hasEnoughFunds ? "border-primary bg-primary/5" : "border-border bg-card opacity-80"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-black text-xl shadow-medium">C</div>
                          <div>
                            <div className="font-bold text-foreground text-sm">Connectify Wallet</div>
                            <div className="text-xs text-muted-foreground font-medium">Balance: ₦{walletBalance.toLocaleString()}</div>
                          </div>
                        </div>
                        {hasEnoughFunds && <CheckCircle className="w-6 h-6 text-primary" fill="currentColor" />}
                      </div>
                    </div>
                  </div>

                  {!hasEnoughFunds && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-destructive/5 rounded-2xl border border-destructive/20 flex flex-col gap-4"
                    >
                      <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-destructive">Insufficient Balance</p>
                          <p className="text-xs text-destructive/70 font-medium">
                            You need an additional ₦{(servicePrice - walletBalance).toLocaleString()}.
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => navigate("/wallet/add-funds")} 
                        className="w-full font-bold shadow-soft"
                      >
                        Add funds to wallet
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-border bg-muted/20 backdrop-blur-sm">
          {step < 3 ? (
            <Button
              onClick={handleContinue}
              disabled={serviceLoading || isPending}
              className="w-full h-14 gradient-primary border-0 font-bold text-lg shadow-glow disabled:opacity-50 active:scale-95 transition-all"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={isPending || !hasEnoughFunds}
              className="w-full h-14 gradient-primary border-0 font-bold text-lg shadow-glow active:scale-95 transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>Confirm & Book</span>
                </div>
              )}
            </Button>
          )}

          <div className="mt-4 flex justify-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-40">Secure Escrow Payment</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingFlow;
