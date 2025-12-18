import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Save, User, Briefcase, MapPin, Phone, Mail, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/useAuth";
import { ImageUpload } from "@/components/ImageUpload";
import { PortfolioUpload } from "@/components/PortfolioUpload";
import { VerificationUpload } from "@/components/VerificationUpload";

const EditProfile = () => {
    const navigate = useNavigate();
    const { data: profileData, isLoading: profileLoading, refetch } = useProfile();
    const { mutate: updateProfile, isPending: updateLoading } = useUpdateProfile();

    // Initialize form state with actual profile data
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        services: '',
        hourlyRate: '',
        experience: '',
        serviceAreas: '',
        phone: '',
        email: '',
    });

    const [avatar, setAvatar] = useState('');

    // Initialize form data when profile data loads
    useEffect(() => {
        if (profileData?.data?.user) {
            setFormData({
                name: profileData.data.user.name || '',
                title: profileData.data.user.providerDetails?.category || '',
                bio: profileData.data.user.profile?.bio || '',
                services: profileData.data.user.providerDetails?.servicesOffered?.join(', ') || '',
                hourlyRate: profileData.data.user.providerDetails?.hourlyRate?.toString() || '',
                experience: profileData.data.user.providerDetails?.yearsOfExperience?.toString() || '',
                serviceAreas: profileData.data.user.profile?.location?.address || '',
                phone: profileData.data.user.phone || '',
                email: profileData.data.user.email || '',
            });
            setAvatar(profileData.data.user.profile?.avatar || '');
        }
    }, [profileData]);

    const handleSave = () => {
        // Prepare the data to send to the API
        const profileUpdateData = {
            name: formData.name,
            providerDetails: {
                category: formData.title,
                hourlyRate: parseInt(formData.hourlyRate),
                yearsOfExperience: parseInt(formData.experience),
                servicesOffered: formData.services.split(',').map(s => s.trim()).filter(s => s),
            },
            profile: {
                bio: formData.bio,
                avatar: avatar,
                location: {
                    address: formData.serviceAreas
                }
            },
            phone: formData.phone,
            email: formData.email
        };

        updateProfile(profileUpdateData, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                navigate(-1);
            },
            onError: (error) => {
                toast.error("Failed to update profile. Please try again.");
                console.error("Profile update error:", error);
            }
        });
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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
                    <p className="text-white/80 text-sm">Polish your professional presence</p>
                </div>
            </div>

            <div className="px-6 -mt-16">
                <div className="bg-card rounded-3xl p-6 shadow-strong border border-border relative z-10">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center -mt-12 mb-8">
                        <ImageUpload
                            currentImage={avatar}
                            onUploadSuccess={(url) => setAvatar(url)}
                            type="profile"
                            shape="circle"
                            className="w-28 h-28"
                        />
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
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Professional Title</label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bio</label>
                                    <Textarea
                                        value={formData.bio}
                                        onChange={(e) => handleChange('bio', e.target.value)}
                                        className="min-h-[120px] bg-muted/30 border-border/50 focus:bg-background transition-smooth resize-none"
                                        placeholder="Tell customers about your expertise..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Services */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
                                <Briefcase className="w-4 h-4" />
                                <h3>Professional Services</h3>
                            </div>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Services Offered</label>
                                    <Input
                                        value={formData.services}
                                        onChange={(e) => handleChange('services', e.target.value)}
                                        placeholder="e.g. Plumbing, Electrical, Repairs"
                                        className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth"
                                    />
                                    <p className="text-xs text-muted-foreground">Separate services with commas</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hourly Rate (₦)</label>
                                        <Input
                                            type="number"
                                            value={formData.hourlyRate}
                                            onChange={(e) => handleChange('hourlyRate', e.target.value)}
                                            className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience (Years)</label>
                                        <Input
                                            type="number"
                                            value={formData.experience}
                                            onChange={(e) => handleChange('experience', e.target.value)}
                                            className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Location */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
                                <MapPin className="w-4 h-4" />
                                <h3>Contact & Location</h3>
                            </div>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Service Areas</label>
                                    <Input
                                        value={formData.serviceAreas}
                                        onChange={(e) => handleChange('serviceAreas', e.target.value)}
                                        className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className="pl-10 h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            type="email"
                                            className="pl-10 h-11 bg-muted/30 border-border/50 focus:bg-background transition-smooth"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Portfolio Management */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
                                <Sparkles className="w-4 h-4" />
                                <h3>Portfolio</h3>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Showcase your best work to attract more customers
                                </p>
                                <PortfolioUpload
                                    userId={profileData?.data?.user?._id}
                                    currentImages={profileData?.data?.user?.profile?.portfolio || []}
                                    maxImages={10}
                                    onUploadComplete={() => refetch()}
                                />
                            </div>
                        </div>

                        {/* Verification Documents */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border pb-2">
                                <span className="text-xl">🪪</span>
                                <h3>Verification Documents</h3>
                            </div>

                            <div>
                                {profileData?.data?.user?.profile?.verification?.verified ? (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">✅</span>
                                            <div>
                                                <p className="text-sm font-semibold text-green-900 dark:text-green-100">Verified Provider</p>
                                                <p className="text-xs text-green-700 dark:text-green-300">
                                                    Your documents have been approved
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : profileData?.data?.user?.profile?.verification?.documents?.length > 0 ? (
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">⏳</span>
                                            <div>
                                                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Verification Pending</p>
                                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                                    We're reviewing your documents (24-48 hours)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                <p className="text-xs text-muted-foreground mb-4">
                                    Upload your ID and business documents to get verified
                                </p>
                                <VerificationUpload onUploadComplete={() => refetch()} />
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={updateLoading}
                        className="w-full mt-8 gradient-primary border-0 h-12 font-semibold shadow-medium hover:shadow-strong transition-all hover:scale-[1.02]"
                    >
                        {updateLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
