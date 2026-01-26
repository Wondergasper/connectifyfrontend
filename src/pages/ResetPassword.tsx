import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            if (!token) throw new Error("Invalid reset token");
            await api.auth.resetPassword(token, password);
            setSuccess(true);
            toast.success("Password reset successful!");
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Reset password error:", error);
            toast.error(error.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-sm text-center space-y-6 animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold">Password Reset</h1>
                    <p className="text-muted-foreground">
                        Your password has been successfully reset. You can now login with your new password.
                    </p>
                    <Button
                        onClick={() => navigate("/auth")}
                        className="w-full h-12 gradient-primary"
                    >
                        Login Now
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-sm animate-fade-in">
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground">
                        Enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-11 h-12"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-11 h-12"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 text-base font-semibold gradient-primary"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
