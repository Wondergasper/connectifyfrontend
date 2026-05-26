import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, HelpCircle, Mail, MessageSquare, Phone, ShieldQuestion } from "lucide-react";

const supportActions = [
  {
    icon: MessageSquare,
    label: "Chat with Support",
    subtitle: "Start a support conversation",
    action: "messages",
  },
  {
    icon: Mail,
    label: "Email Support",
    subtitle: "support@connectify.ng",
    action: "email",
  },
  {
    icon: Phone,
    label: "Call Support",
    subtitle: "+234 800 000 0000",
    action: "phone",
  },
];

const faqs = [
  {
    title: "Bookings",
    body: "Manage booking updates, payments, cancellations, and provider communication.",
  },
  {
    title: "Wallet",
    body: "Get help with funding your wallet, withdrawals, receipts, and saved cards.",
  },
  {
    title: "Account Safety",
    body: "Report suspicious activity or recover access to your Connectify account.",
  },
];

const Support = () => {
  const navigate = useNavigate();

  const handleAction = (action: string) => {
    if (action === "messages") {
      navigate("/messages");
      return;
    }

    if (action === "email") {
      window.location.href = "mailto:support@connectify.ng";
      return;
    }

    if (action === "phone") {
      window.location.href = "tel:+2348000000000";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="gradient-primary px-6 pt-12 pb-8 rounded-b-[2rem] shadow-strong">
        <button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">Help & Support</h1>
          <p className="text-sm text-white/80 mt-1">Get help with your account and bookings</p>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        <div className="bg-card rounded-2xl shadow-medium border border-border overflow-hidden divide-y divide-border">
          {supportActions.map((item) => (
            <button
              key={item.label}
              onClick={() => handleAction(item.action)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Common Help
          </h2>
          <div className="space-y-3">
            {faqs.map((item) => (
              <div key={item.title} className="bg-card rounded-2xl border border-border p-4 shadow-soft">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    {item.title === "Account Safety" ? (
                      <ShieldQuestion className="w-5 h-5 text-foreground" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-5">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
