import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Save, User, MapPin, Phone, Mail, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const EditCustomerProfile = () => {
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState(["House Cleaning", "Plumbing", "Tutoring", "Beauty"]);

    const handleSave = () => {
        toast.success("Profile updated successfully!");
        navigate(-1);
    };

    const togglePreference = (pref: string) => {
        if (preferences.includes(pref)) {
            setPreferences(preferences.filter(p => p !== pref));
        } else {
            setPreferences([...preferences, pref]);
        }
    };

    const availableServices = ["House Cleaning", "Plumbing", "Tutoring", "Beauty", "Gardening", "Electrical", "Catering"];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="gradient-primary px-6 pt-12 pb-20 rounded-b-[3rem] relative overflow-hidden shadow-strong">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Edit Profile</h1>
                    <p className="text-white/80 text-sm">Update your personal preferences</p>
                </div>
            </div>

            <div className="px-6 -mt-16">
                <div className="bg-card rounded-3xl p-6 shadow-strong border border-border relative z-10">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center -mt-12 mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-card shadow-medium">
                                <img src="https://github.com/shadcn.png" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                            <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-medium hover:scale-110 transition-smooth border-2 border-card">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 font-medium">Tap to update photo</p>
                    </div>

                    {/* Form Sections */}
                    <div className="space-y-8">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
                                <User className="w-4 h-4" />
                                <h3>Personal Information</h3>
                            </div>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                                    <Input defaultValue="Samuel Adeyemi" className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bio</label>
                                    <Textarea
                                        defaultValue="Love clean spaces and efficient service. Always looking for reliable professionals."
                                        className="min-h-[100px] bg-muted/30 border-border/50 focus:bg-background transition-smooth resize-none leading-relaxed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Home Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input defaultValue="Lekki Phase 1, Lagos" className="pl-10 h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
                                <Phone className="w-4 h-4" />
                                <h3>Contact Information</h3>
                            </div>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input defaultValue="+234 800 987 6543" className="pl-10 h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input defaultValue="samuel.adeyemi@email.com" type="email" className="pl-10 h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
                                <Heart className="w-4 h-4" />
                                <h3>Service Preferences</h3>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs text-muted-foreground">Select the services you are most interested in:</p>
                                <div className="flex flex-wrap gap-2">
                                    {availableServices.map((service) => (
                                        <button
                                            key={service}
                                            onClick={() => togglePreference(service)}
                                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${preferences.includes(service)
                                                    ? "bg-primary text-white shadow-md scale-105"
                                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                }`}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        className="w-full mt-8 gradient-primary border-0 h-12 font-semibold shadow-medium hover:shadow-strong transition-all hover:scale-[1.02]"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditCustomerProfile;
