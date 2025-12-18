import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Availability = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user profile to get provider ID
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.auth.getProfile(),
  });

  // Fetch availability data from API for the current day (as example)
  const { data: availability, isLoading: availabilityLoading, error } = useQuery({
    queryKey: ['availability', { providerId: profileData?.data?.user?._id, date: new Date().toISOString().split('T')[0] }],
    queryFn: () => api.availability.get({ providerId: profileData?.data?.user?._id, date: new Date().toISOString().split('T')[0] }),
    enabled: !!profileData?.data?.user?._id
  });

  // Update availability mutation
  const updateAvailabilityMutation = useMutation({
    mutationFn: (availabilityData: {
      date: string;
      isAvailable: boolean;
      slots: Array<{ startTime: string; endTime: string; isBooked: boolean }>
    }) => api.availability.update(availabilityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success("Availability updated successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to update availability:", error);
      toast.error("Failed to update availability. Please try again.");
    }
  });

  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState([
    { startTime: "09:00", endTime: "10:00", booked: false },
    { startTime: "10:00", endTime: "11:00", booked: true },
    { startTime: "11:00", endTime: "12:00", booked: false },
    { startTime: "14:00", endTime: "15:00", booked: false },
    { startTime: "15:00", endTime: "16:00", booked: false },
  ]);

  // Load availability when data becomes available
  useEffect(() => {
    if (availability?.data) {
      const avData = availability.data as {
        isAvailable: boolean;
        slots: Array<{ startTime: string; endTime: string; isBooked: boolean }>;
      };
      setIsAvailable(avData.isAvailable ?? true);
      setTimeSlots(prev =>
        prev.map(slot => {
          // Check if this slot is booked based on the availability data
          const bookedSlot = avData.slots?.find((s) => s.startTime === slot.startTime && s.isBooked);
          return {
            ...slot,
            booked: bookedSlot ? true : false
          };
        })
      );
    }
  }, [availability]);

  const handleSlotToggle = (index: number) => {
    setTimeSlots(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], booked: !updated[index].booked };
      return updated;
    });
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setIsAvailable(checked);

    // Prepare availability data for API
    const availabilityData = {
      date: selectedDate,
      isAvailable: checked,
      slots: timeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: slot.booked || false
      }))
    };

    updateAvailabilityMutation.mutate(availabilityData);
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setTimeSlots(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddSlot = () => {
    setTimeSlots(prev => [
      ...prev,
      { startTime: "12:00", endTime: "13:00", booked: false }
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Prepare availability data for API
    const availabilityData = {
      date: selectedDate,
      isAvailable: isAvailable,
      slots: timeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: slot.booked || false
      }))
    };

    updateAvailabilityMutation.mutate(availabilityData);
  };

  const isLoading = profileLoading || availabilityLoading;

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-xl transition-smooth"
              disabled={updateAvailabilityMutation.isPending}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Availability</h1>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-card rounded-2xl p-5 shadow-soft border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <label className="text-sm font-medium text-foreground">Select Date</label>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
            min={new Date().toISOString().split('T')[0]}
            disabled={updateAvailabilityMutation.isPending}
          />
        </div>
      </div>

      {/* Current Status */}
      <div className="px-6 pb-4">
        {error ? (
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-border text-center py-10">
            <p className="text-muted-foreground">Failed to load availability. Please try again.</p>
            <Button onClick={() => window.location.reload()} className="mt-3">Reload</Button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-border">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Accepting Bookings</h3>
                <p className="text-sm text-muted-foreground">
                  {isAvailable ? "You're available for bookings on this date" : "Not available for bookings"}
                </p>
              </div>
              <Switch
                checked={isAvailable}
                onCheckedChange={handleAvailabilityChange}
                disabled={updateAvailabilityMutation.isPending}
              />
            </div>
            <div
              className={`mt-3 px-3 py-2 rounded-xl ${isAvailable ? "bg-accent/10" : "bg-muted/30"
                }`}
            >
              <span
                className={`text-xs font-medium ${isAvailable ? "text-accent" : "text-muted-foreground"
                  }`}
              >
                {isAvailable ? "● Available" : "○ Unavailable"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Time Slots */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Time Slots</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddSlot}
            disabled={updateAvailabilityMutation.isPending}
          >
            + Add Slot
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 shadow-soft border border-border animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 shadow-soft border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Slot {index + 1}</span>
                  </div>
                  <Switch
                    checked={!slot.booked}
                    onCheckedChange={(checked) => handleSlotToggle(index)}
                    disabled={updateAvailabilityMutation.isPending}
                  />
                </div>

                <div className="flex items-center gap-3 pl-8">
                  <div className="flex items-center gap-2 flex-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground flex-1"
                      disabled={updateAvailabilityMutation.isPending}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">to</span>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground flex-1"
                      disabled={updateAvailabilityMutation.isPending}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveSlot(index)}
                    disabled={updateAvailabilityMutation.isPending || timeSlots.length <= 1}
                    className="h-9 w-9 p-0"
                  >
                    ×
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground mt-2 pl-8">
                  {slot.booked ? "Booked" : "Available"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="px-6 pt-4 space-y-3">
        <Button
          onClick={handleSave}
          disabled={updateAvailabilityMutation.isPending || isLoading}
          className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-semibold"
        >
          {updateAvailabilityMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            "Save Availability"
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={updateAvailabilityMutation.isPending}
          className="w-full h-12 font-semibold"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default Availability;
