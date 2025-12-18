import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.auth.forgotPassword(email);
            setSuccess(true);
            toast.success("Reset link sent!");
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast.error(error.message || "Failed to send reset link");
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
                    <h1 className="text-2xl font-bold">Check your email</h1>
                    <p className="text-muted-foreground">
                        We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                    </p>
                    <Button
                        onClick={() => navigate("/auth")}
                        variant="outline"
                        className="w-full"
                    >
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="px-6 py-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/auth")}
                    className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Button>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 pb-20">
                <div className="w-full max-w-sm animate-fade-in">
                    <div className="text-center mb-8 space-y-2">
                        <h1 className="text-2xl font-bold">Forgot Password?</h1>
                        <p className="text-muted-foreground">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
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
                            {loading ? "Sending Link..." : "Send Reset Link"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
