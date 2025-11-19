import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const Availability = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);

  const weekDays = [
    { day: "Monday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Wednesday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Thursday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Friday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Saturday", enabled: false, start: "09:00", end: "17:00" },
    { day: "Sunday", enabled: false, start: "09:00", end: "17:00" },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-xl transition-smooth"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Availability</h1>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-card rounded-2xl p-5 shadow-soft border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Current Status</h3>
              <p className="text-sm text-muted-foreground">
                {isAvailable ? "You're accepting new bookings" : "Not accepting bookings"}
              </p>
            </div>
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>
          <div
            className={`mt-3 px-3 py-2 rounded-xl ${
              isAvailable ? "bg-accent/10" : "bg-muted/30"
            }`}
          >
            <span
              className={`text-xs font-medium ${
                isAvailable ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {isAvailable ? "● Available Now" : "○ Unavailable"}
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="px-6 py-4">
        <h3 className="font-semibold text-foreground mb-3">Weekly Schedule</h3>
        <div className="space-y-3">
          {weekDays.map((schedule) => (
            <div
              key={schedule.day}
              className="bg-card rounded-2xl p-4 shadow-soft border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">{schedule.day}</span>
                </div>
                <Switch defaultChecked={schedule.enabled} />
              </div>

              {schedule.enabled && (
                <div className="flex items-center gap-3 pl-8">
                  <div className="flex items-center gap-2 flex-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={schedule.start}
                      className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">to</span>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={schedule.end}
                      className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="px-6 pt-4">
        <Button
          onClick={() => navigate(-1)}
          className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-semibold"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Availability;
