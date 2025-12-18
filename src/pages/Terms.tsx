import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Shield, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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
                        <Scale className="w-5 h-5 text-primary" />
                        Terms of Service
                    </div>
                    <div className="w-20" /> {/* Spacer for centering */}
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-8">
                <div className="space-y-6">
                    <div className="text-center space-y-4 mb-12">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Please read these terms carefully before using the Connectify platform.
                            By accessing or using our services, you agree to be bound by these terms.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="grid gap-8">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                1. Agreement to Terms
                            </h2>
                            <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground">
                                <p>
                                    By accessing or using Connectify, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">2. User Accounts</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                                    <li>You agree not to disclose your password to any third party.</li>
                                    <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">3. Service Providers</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    Service Providers on Connectify are independent contractors and not employees of Connectify. We verify providers but do not guarantee the quality of their work.
                                </p>
                                <p>
                                    Providers must:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Maintain accurate profile information and availability.</li>
                                    <li>Provide services with professional care and skill.</li>
                                    <li>Respect customer privacy and property.</li>
                                    <li>Adhere to our community guidelines and code of conduct.</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">4. Payments and Refunds</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    All payments are processed securely through our platform. Users agree to pay all charges at the prices then in effect for their purchases.
                                </p>
                                <p>
                                    Refunds are handled on a case-by-case basis in accordance with our Refund Policy. Disputes must be raised within 24 hours of service completion.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">5. Prohibited Activities</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>You may not use the Service for any of the following purposes:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Violating any applicable laws or regulations.</li>
                                    <li>Harassing, abusing, or harming another person.</li>
                                    <li>Impersonating any person or entity.</li>
                                    <li>Interfering with or disrupting the Service or servers.</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
                            <div className="text-muted-foreground">
                                <p>
                                    In no event shall Connectify, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">7. Contact Us</h2>
                            <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about these Terms, please contact us:
                                </p>
                                <div className="space-y-2">
                                    <p className="font-medium">Email: legal@connectify.com</p>
                                    <p className="font-medium">Phone: +234 123 456 7890</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
