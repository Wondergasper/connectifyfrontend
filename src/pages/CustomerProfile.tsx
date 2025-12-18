import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MapPin, Calendar, Phone, Mail, Edit, User, Award, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useAuth";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useProfile();

  const handleEditProfile = () => {
    navigate("/profile/customer/edit");
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-8 rounded-b-3xl relative overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {isLoading ? (
          <div className="text-center">
            <div className="relative mx-auto mb-4 w-24 h-24">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 animate-pulse" />
            </div>
            <div className="h-6 bg-white/20 rounded w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded w-32 mx-auto mb-3 animate-pulse"></div>
            <div className="h-5 bg-white/20 rounded w-40 mx-auto animate-pulse"></div>
          </div>
        ) : (
          /* Profile Info */
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-strong">
                <User className="w-12 h-12 text-white" />
              </div>
              <button
                onClick={handleEditProfile}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shadow-medium hover:bg-white/90 transition-smooth"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{profileData?.data?.user?.name || 'User Name'}</h1>
            <p className="text-sm text-white/80 mb-3">{profileData?.data?.user?.profile?.location?.address || 'Location not set'}</p>

            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <Award className="w-4 h-4 text-white" />
              <span className="text-xs font-medium text-white">{
                profileData?.data?.user?.profile?.verification?.verified ? 'Verified Customer' : 'Customer'
              }</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-2xl p-4 text-center shadow-soft border border-border animate-pulse">
              <div className="h-6 bg-muted rounded w-8 mx-auto mb-2"></div>
              <div className="h-3 bg-muted rounded w-12 mx-auto"></div>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center shadow-soft border border-border animate-pulse">
              <div className="h-6 bg-muted rounded w-8 mx-auto mb-2"></div>
              <div className="h-3 bg-muted rounded w-12 mx-auto"></div>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center shadow-soft border border-border animate-pulse">
              <div className="h-6 bg-muted rounded w-8 mx-auto mb-2"></div>
              <div className="h-3 bg-muted rounded w-12 mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-2xl p-4 text-center shadow-soft border border-border">
              <div className="text-2xl font-bold text-foreground">{profileData?.data?.user?.bookingCount || 0}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" />
                Bookings
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center shadow-soft border border-border">
              <div className="text-2xl font-bold text-foreground">{profileData?.data?.user?.rating?.average?.toFixed(1) || '0.0'}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                Rating
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 text-center shadow-soft border border-border">
              <div className="text-2xl font-bold text-foreground">₦{profileData?.data?.user?.totalSpent?.toLocaleString() || '0'}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Spent
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
        {isLoading ? (
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-border animate-pulse">
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
            <div className="space-y-3">
              <div className="h-5 bg-muted rounded w-full"></div>
              <div className="h-5 bg-muted rounded w-full"></div>
              <div className="h-5 bg-muted rounded w-full"></div>
              <div className="h-5 bg-muted rounded w-full"></div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-5 shadow-soft border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {profileData?.data?.user?.profile?.bio || 'No bio provided.'}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">{profileData?.data?.user?.profile?.location?.address || 'Location not set'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">{profileData?.data?.user?.phone || 'Phone not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">{profileData?.data?.user?.email || 'Email not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Member since {profileData?.data?.user?.createdAt ? new Date(profileData.data.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'date unknown'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Preferred Services</h2>

        <div className="flex flex-wrap gap-2">
          {['House Cleaning', 'Plumbing', 'Tutoring', 'Beauty'].map((service) => (
            <div
              key={service}
              className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
            >
              {service}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 space-y-3">
        <Button
          onClick={handleEditProfile}
          className="w-full h-12 gradient-primary border-0 font-semibold shadow-medium"
        >
          Edit Profile
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 font-semibold"
          onClick={() => navigate("/customer")}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CustomerProfile;
