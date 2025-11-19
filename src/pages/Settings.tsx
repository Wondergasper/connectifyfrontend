import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ChevronRight, User, Bell, Shield, Globe, HelpCircle, LogOut, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface SettingsProps {
  role?: "customer" | "provider";
}

const Settings = ({ role = "customer" }: SettingsProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    {
      icon: User,
      label: "Edit Profile",
      subtitle: "Update your personal information",
      action: () => navigate(role === "customer" ? "/profile/customer/edit" : "/profile/edit"),
    },
    {
      icon: Bell,
      label: "Notification Preferences",
      subtitle: "Manage your alerts",
      toggle: true,
      value: notifications,
      onChange: setNotifications,
    },
    {
      icon: Shield,
      label: "Security",
      subtitle: "PIN, biometrics, and password",
      action: () => { },
    },
    {
      icon: Globe,
      label: "Language",
      subtitle: "English",
      action: () => { },
    },
  ];

  const otherItems = [
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => { },
    },
    {
      icon: LogOut,
      label: "Logout",
      action: () => navigate("/auth"),
      danger: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-6 rounded-b-3xl relative overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white mb-1 drop-shadow-md">Settings</h1>
          <p className="text-sm text-white/80">Manage your account preferences</p>
        </div>
      </div>

      {/* Appearance */}
      <div className="px-6 py-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Appearance
        </h2>
        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-foreground">Dark Mode</div>
                <div className="text-xs text-muted-foreground">Switch to dark theme</div>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="px-6 pb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          General
        </h2>
        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden divide-y divide-border">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground text-sm">{item.label}</div>
                  {item.subtitle && (
                    <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                  )}
                </div>
              </div>
              {item.toggle && item.onChange ? (
                <Switch
                  checked={item.value}
                  onCheckedChange={item.onChange}
                />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Refer a Friend */}
      <div className="px-6 pb-6">
        <div className="gradient-card rounded-2xl p-5 shadow-medium">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🎁</div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Refer a Friend</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Invite friends and earn ₦5,000 when they complete their first job
              </p>
              <Button className="w-full h-10 gradient-primary border-0 font-semibold shadow-medium text-sm">
                Share Invite Link
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Other */}
      <div className="px-6 pb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Other
        </h2>
        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden divide-y divide-border">
          {otherItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth ${item.danger ? "text-destructive" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.danger ? "bg-destructive/10" : "bg-muted"
                  }`}>
                  <item.icon className={`w-5 h-5 ${item.danger ? "text-destructive" : "text-foreground"}`} />
                </div>
                <div className={`font-medium text-sm ${item.danger ? "text-destructive" : "text-foreground"}`}>
                  {item.label}
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${item.danger ? "text-destructive" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Version */}
      <div className="px-6 text-center">
        <p className="text-xs text-muted-foreground">
          Connectify Nigeria v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;
