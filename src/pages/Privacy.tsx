import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Lock, Eye, Server, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <Lock className="w-5 h-5 text-primary" />
                        Privacy Policy
                    </div>
                    <div className="w-20" /> {/* Spacer for centering */}
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-8">
                <div className="space-y-6">
                    <div className="text-center space-y-4 mb-12">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            We value your privacy and are committed to protecting your personal data.
                            This policy explains how we collect, use, and safeguard your information.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="grid gap-8">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <Eye className="w-5 h-5 text-primary" />
                                1. Information We Collect
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>We collect information that you provide directly to us, including:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Personal Information:</strong> Name, email address, phone number, and profile picture.</li>
                                    <li><strong>Verification Data:</strong> Government ID, professional certifications (for providers).</li>
                                    <li><strong>Payment Information:</strong> Transaction history and wallet details (processed securely).</li>
                                    <li><strong>Usage Data:</strong> Information about how you use our website and services.</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <Server className="w-5 h-5 text-primary" />
                                2. How We Use Your Information
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>We use the information we collect to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Provide, maintain, and improve our services.</li>
                                    <li>Process transactions and send related information.</li>
                                    <li>Verify the identity of service providers.</li>
                                    <li>Send administrative messages, updates, and security alerts.</li>
                                    <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-primary" />
                                3. Information Sharing
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    We do not sell your personal information. We may share your information in the following circumstances:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>With Service Providers:</strong> To facilitate bookings and services.</li>
                                    <li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities.</li>
                                    <li><strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition.</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">4. Data Security</h2>
                            <div className="text-muted-foreground">
                                <p>
                                    We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">5. Your Rights</h2>
                            <div className="text-muted-foreground">
                                <p>
                                    Depending on your location, you may have rights regarding your personal data, including:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>The right to access and receive a copy of your personal data.</li>
                                    <li>The right to rectify or update your personal data.</li>
                                    <li>The right to request deletion of your personal data.</li>
                                    <li>The right to restrict or object to the processing of your personal data.</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">6. Contact Us</h2>
                            <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about this Privacy Policy, please contact us:
                                </p>
                                <div className="space-y-2">
                                    <p className="font-medium">Email: privacy@connectify.com</p>
                                    <p className="font-medium">Address: 123 Tech Hub, Lagos, Nigeria</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
