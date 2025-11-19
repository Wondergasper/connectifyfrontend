import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MessageSquare, Star, Wallet, CheckCheck } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: "booking",
      icon: Calendar,
      title: "Booking Confirmed",
      message: "Your cleaning service with Chioma is confirmed for tomorrow at 10:00 AM",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "message",
      icon: MessageSquare,
      title: "New Message",
      message: "Emeka sent you a message about your plumbing request",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "payment",
      icon: Wallet,
      title: "Payment Received",
      message: "₦8,000 has been added to your wallet",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "review",
      icon: Star,
      title: "New Review",
      message: "Samuel left you a 5-star review. Great job!",
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      type: "booking",
      icon: CheckCheck,
      title: "Service Completed",
      message: "Your electrical repair service has been marked as completed",
      time: "3 days ago",
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl transition-smooth">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          </div>
          <button className="text-sm font-medium text-accent hover:text-accent/80 transition-smooth">
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 pt-4 space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <button
              key={notification.id}
              className={`w-full p-4 rounded-2xl border transition-smooth text-left ${
                notification.read
                  ? "bg-card border-border"
                  : "bg-accent/5 border-accent/20"
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notification.read ? "bg-muted" : "gradient-primary"
                }`}>
                  <Icon className={`w-6 h-6 ${notification.read ? "text-muted-foreground" : "text-white"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{notification.title}</h3>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty State (if no notifications) */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No notifications yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            We'll notify you when there's something new to see
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
