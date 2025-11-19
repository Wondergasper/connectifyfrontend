import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X, Calendar, Clock, CheckCircle, CreditCard } from "lucide-react";

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();

  const times = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM"
  ];

  const handleConfirm = () => {
    // Show success animation
    setTimeout(() => {
      navigate("/customer");
    }, 2000);
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
            <p className="text-sm text-muted-foreground">
              Step {step} of 3
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-smooth ${
                  i <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-4 p-4 bg-gradient-card rounded-2xl border border-border">
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-3xl">
                  👩🏾
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Chioma Nwosu</h3>
                  <p className="text-sm text-muted-foreground">House Cleaning</p>
                  <p className="text-sm font-semibold text-primary mt-1">₦8,000/hr</p>
                </div>
              </div>

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
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-xs text-muted-foreground text-center">
                  📅 Book up to 2 weeks in advance
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {times.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-2 rounded-xl border-2 transition-smooth text-sm font-medium ${
                      selectedTime === time
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              {/* Booking Summary */}
              <div className="p-4 bg-gradient-card rounded-2xl border border-border space-y-3">
                <h3 className="font-semibold text-foreground">Booking Summary</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">House Cleaning</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider</span>
                    <span className="font-medium text-foreground">Chioma Nwosu</span>
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
                      <span className="text-xl font-bold text-primary">₦8,000</span>
                    </div>
                  </div>
                </div>
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
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold">
                        W
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">Connectify Wallet</div>
                        <div className="text-xs text-muted-foreground">Balance: ₦45,000</div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-primary" fill="currentColor" />
                  </div>
                </button>
              </div>

              <div className="p-4 bg-accent/10 rounded-xl">
                <p className="text-xs text-accent text-center">
                  🔒 Secure payment. Money held until service is completed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border space-y-2">
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !selectedDate : !selectedTime}
              className="w-full h-14 gradient-primary border-0 font-semibold disabled:opacity-50"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              className="w-full h-14 gradient-primary border-0 font-semibold"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm & Pay
            </Button>
          )}

          {step > 1 && (
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="w-full"
            >
              Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
