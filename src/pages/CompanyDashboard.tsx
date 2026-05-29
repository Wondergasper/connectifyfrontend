import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProfile, useLogout } from "@/hooks/useAuth";
import {
  TrendingUp,
  Calendar,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Wallet,
  Settings,
  MessageSquare,
  Bell,
  Plus,
  Edit,
  Trash,
  CheckCircle,
  FileText,
  UserCheck,
  Send,
  Download,
  AlertTriangle,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Sliders,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Initial Data for MVP ---
const initialServices = [
  { id: "s1", name: "Corporate Office AC Maintenance", category: "Repair Services", description: "Full central and split unit HVAC servicing for businesses.", pricingType: "negotiable", startingPrice: 45000, isActive: true },
  { id: "s2", name: "Deep Industrial Facility Cleaning", category: "House Cleaning", description: "Post-construction or monthly sanitation for factories and corporate spaces.", pricingType: "quote-based", startingPrice: 150000, isActive: true },
  { id: "s3", name: "Commercial Plumbing Repiping", category: "Plumbing", description: "Large-scale pipe replacement and diagnostics for high-rises.", pricingType: "fixed", startingPrice: 85000, isActive: false },
];

const initialRequests = [
  { id: "r1", clientName: "Dangote Refinery Office", category: "Repair Services", description: "Maintenance of 14 split air conditioner units and 2 chillers before corporate audit next week.", location: "Ibeju-Lekki, Lagos", budget: "₦250,000", urgency: "Urgent", dateTime: "2026-06-03 at 09:00 AM", status: "pending" },
  { id: "r2", clientName: "Eko Hotels & Suites", category: "House Cleaning", description: "Professional post-event deep cleaning of Grand Ballroom after conference.", location: "Victoria Island, Lagos", budget: "₦400,000", urgency: "Standard", dateTime: "2026-06-05 at 11:30 PM", status: "quoted" },
  { id: "r3", clientName: "Standard Chartered HQ", category: "Electrical", description: "Emergency server room power line backup and distribution board overhaul.", location: "Admiralty Way, Lekki", budget: "₦550,000", urgency: "Emergency", dateTime: "2026-05-30 at 02:00 AM", status: "pending" },
];

const initialQuotes = [
  { id: "q1", requestId: "r2", clientName: "Eko Hotels & Suites", category: "House Cleaning", quotedAmount: 380000, deliveryTime: "12 hours", status: "pending", message: "Our team of 15 senior staff will execute this using high-grade industrial sweepers.", terms: "50% upfront, 50% upon delivery check" }
];

const initialStaff = [
  { id: "st1", name: "David Okafor", role: "Lead HVAC Engineer", phone: "+234 803 111 2222", email: "david.o@swiftrepairs.com", status: "active" },
  { id: "st2", name: "Blessing Samuel", role: "Facility Supervisor", phone: "+234 812 333 4444", email: "blessing.s@swiftrepairs.com", status: "active" },
  { id: "st3", name: "Emeka Nwosu", role: "Senior Plumber", phone: "+234 705 555 6666", email: "emeka.n@swiftrepairs.com", status: "inactive" },
];

const initialJobs = [
  { id: "j1", customer: "Chevron Executive Guest House", service: "Central AC System Flush", status: "In Progress", staffId: "st1", staffName: "David Okafor", date: "2026-05-29", price: 180000 },
  { id: "j2", customer: "PwC Nigeria", service: "Office Sanitation & Disinfection", status: "Assigned", staffId: "st2", staffName: "Blessing Samuel", date: "2026-06-01", price: 290000 },
  { id: "j3", customer: "Access Bank Marina Branch", service: "Industrial Water Main Fix", status: "New", staffId: "", staffName: "Unassigned", date: "2026-05-31", price: 75000 },
  { id: "j4", customer: "Ikeja Electric", service: "Commercial Wiring Upgrade", status: "Completed", staffId: "st1", staffName: "David Okafor", date: "2026-05-25", price: 340000 },
];

const initialReviews = [
  { id: "rev1", clientName: "Shell Nigeria Office", rating: 5, comment: "Swift Repairs Ltd handled our facility sanitization perfectly. Arrived with advanced machinery and finished 2 hours early.", date: "2026-05-20" },
  { id: "rev2", clientName: "Guaranty Trust Bank", rating: 4, comment: "Very professional plumbing services. Transparent quote, though we had minor scheduling delay.", date: "2026-05-14" },
];

const initialPayments = [
  { id: "p1", customer: "Ikeja Electric", service: "Commercial Wiring Upgrade", amount: 340000, date: "2026-05-25", status: "completed", invoiceRef: "INV-2026-004" },
  { id: "p2", customer: "Chevron Executive Guest House", service: "Central AC System Flush", amount: 180000, date: "2026-05-29", status: "pending", invoiceRef: "INV-2026-005" },
];

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { data: profileData } = useProfile();
  const logoutMutation = useLogout();

  // Core App states
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Feature states (Simulating Local Database Operations)
  const [services, setServices] = useState(initialServices);
  const [requests, setRequests] = useState(initialRequests);
  const [quotes, setQuotes] = useState(initialQuotes);
  const [staff, setStaff] = useState(initialStaff);
  const [jobs, setJobs] = useState(initialJobs);
  const [reviews, setReviews] = useState(initialReviews);
  const [payments, setPayments] = useState(initialPayments);

  // Forms / Modals States
  const [newService, setNewService] = useState({ name: "", category: "Repair Services", description: "", pricingType: "fixed", startingPrice: "" });
  const [editingService, setEditingService] = useState<any>(null);
  const [newStaff, setNewStaff] = useState({ name: "", role: "", phone: "", email: "" });
  const [activeRequestForQuote, setActiveRequestForQuote] = useState<any>(null);
  const [quoteForm, setQuoteForm] = useState({ amount: "", delivery: "2 days", message: "", terms: "100% upon inspection" });
  const [viewInvoice, setViewInvoice] = useState<any>(null);
  const [selectedJobToAssign, setSelectedJobToAssign] = useState<any>(null);

  // Business Profile Info
  const user = profileData?.data?.user;
  const companyName = user?.providerDetails?.companyName || "Swift Repairs Ltd";
  const contactName = user?.providerDetails?.contactName || "Jane Doe";
  const verificationStatus = "pending"; // Mock for verification screen

  // --- Handlers ---
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.startingPrice) {
      toast.error("Please fill in all required service details");
      return;
    }
    const service = {
      id: "s" + (services.length + 1),
      name: newService.name,
      category: newService.category,
      description: newService.description,
      pricingType: newService.pricingType,
      startingPrice: Number(newService.startingPrice),
      isActive: true
    };
    setServices([service, ...services]);
    setNewService({ name: "", category: "Repair Services", description: "", pricingType: "fixed", startingPrice: "" });
    toast.success("New commercial service created successfully!");
  };

  const handleToggleService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    toast.success("Service status updated");
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role || !newStaff.phone) {
      toast.error("Please fill in staff name, role, and phone");
      return;
    }
    const member = {
      id: "st" + (staff.length + 1),
      name: newStaff.name,
      role: newStaff.role,
      phone: newStaff.phone,
      email: newStaff.email || "info@swiftrepairs.com",
      status: "active"
    };
    setStaff([...staff, member]);
    setNewStaff({ name: "", role: "", phone: "", email: "" });
    toast.success(`${member.name} successfully registered in staff pool!`);
  };

  const handleToggleStaff = (id: string) => {
    setStaff(staff.map(s => s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s));
    toast.success("Staff availability status toggled");
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.amount || !quoteForm.message) {
      toast.error("Please specify a bid amount and description note");
      return;
    }
    const newQuote = {
      id: "q" + (quotes.length + 1),
      requestId: activeRequestForQuote.id,
      clientName: activeRequestForQuote.clientName,
      category: activeRequestForQuote.category,
      quotedAmount: Number(quoteForm.amount),
      deliveryTime: quoteForm.delivery,
      status: "pending",
      message: quoteForm.message,
      terms: quoteForm.terms
    };
    setQuotes([newQuote, ...quotes]);
    setRequests(requests.map(r => r.id === activeRequestForQuote.id ? { ...r, status: "quoted" } : r));
    toast.success(`Custom B2B quotation submitted to ${activeRequestForQuote.clientName}!`);
    setActiveRequestForQuote(null);
    setQuoteForm({ amount: "", delivery: "2 days", message: "", terms: "100% upon inspection" });
  };

  const handleRejectRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    toast.info("Customer request rejected and cleared");
  };

  const handleAssignJob = (staffId: string) => {
    const chosenStaff = staff.find(s => s.id === staffId);
    if (!chosenStaff) return;
    setJobs(jobs.map(j => j.id === selectedJobToAssign.id
      ? { ...j, status: "Assigned", staffId: chosenStaff.id, staffName: chosenStaff.name }
      : j
    ));
    toast.success(`Job dispatched to ${chosenStaff.name}!`);
    setSelectedJobToAssign(null);
  };

  const handleAdvanceJobStatus = (jobId: string, nextStatus: string) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: nextStatus } : j));
    toast.success(`Job status updated to ${nextStatus}`);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Stats calculation
  const totalEarnings = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const newLeadsCount = requests.filter(r => r.status === "pending").length;
  const activeJobsCount = jobs.filter(j => ["New", "Accepted", "Assigned", "In Progress"].includes(j.status)).length;
  const pendingQuotesCount = quotes.filter(q => q.status === "pending").length;
  const completedJobsCount = jobs.filter(j => j.status === "Completed").length;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground overflow-hidden font-sans">
      {/* ========================================================
          MOBILE NAV HEADER
         ======================================================== */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-card border-b border-border shadow-soft z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-soft">
            C
          </div>
          <div>
            <span className="font-bold text-sm leading-none block">{companyName}</span>
            <span className="text-[10px] text-primary font-semibold tracking-wider uppercase block">B2B Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center border border-border"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* ========================================================
          DESKTOP & MOBILE SIDEBAR
         ======================================================== */}
      <AnimatePresence>
        {(isSidebarOpen || true) && (
          <motion.div
            className={`fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-50 transform md:relative md:translate-x-0 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          >
            {/* Sidebar Branding */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-medium">
                  C
                </div>
                <div>
                  <h2 className="font-bold text-base leading-tight text-foreground">{companyName}</h2>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Verification Pending</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Navigation */}
            <div className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
              {[
                { id: "overview", label: "Overview Dashboard", icon: Sliders },
                { id: "services", label: "Service Management", icon: Briefcase },
                { id: "leads", label: "B2B Leads Board", icon: Bell, count: newLeadsCount },
                { id: "quotes", label: "Bids & Quotations", icon: Send, count: pendingQuotesCount },
                { id: "dispatch", label: "Team Dispatch", icon: Users },
                { id: "jobs", label: "Job Dispatcher", icon: Calendar, count: activeJobsCount },
                { id: "finances", label: "Payouts & Billings", icon: Wallet },
                { id: "reviews", label: "Feedback Reviews", icon: Star },
                { id: "settings", label: "Profile & Settings", icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-smooth ${
                    activeTab === item.id
                      ? "gradient-primary text-white shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-white" : "text-primary"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === item.id ? "bg-white text-primary" : "bg-primary text-white"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center gap-3 px-2 py-2 mb-3 rounded-lg bg-card border border-border">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                  {contactName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-none truncate text-foreground">{contactName}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">Corporate Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-destructive/25 text-destructive bg-destructive/5 hover:bg-destructive hover:text-white transition-smooth text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out Portal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ========================================================
          MAIN WORKSPACE CONTENT AREA
         ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 md:p-8 space-y-6">
        {/* Top welcome status bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground capitalize">
              {activeTab} Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              B2B Agency Dashboard • {companyName} • Managed by {contactName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold shadow-soft">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              CAC Verification Pending
            </div>
            <button className="relative w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center border border-border transition-smooth">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB VIEW SWITCHER (Overview, Services, Leads, Quotes, etc)
           ======================================================== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col space-y-6"
          >
            {/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* 7 Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Earnings", value: `₦${totalEarnings.toLocaleString()}`, sub: `Commission paid (10%)`, icon: TrendingUp, color: "text-green-500" },
                    { label: "Pending Payout", value: `₦${pendingPayments.toLocaleString()}`, sub: `Escrowed in bookings`, icon: DollarSign, color: "text-blue-500" },
                    { label: "New Leads", value: newLeadsCount.toString(), sub: `Awaiting quotations`, icon: Bell, color: "text-amber-500" },
                    { label: "Active Dispatch", value: activeJobsCount.toString(), sub: `Jobs in progress`, icon: Calendar, color: "text-purple-500" },
                    { label: "Pending Bids", value: pendingQuotesCount.toString(), sub: `Corporate reviews`, icon: Send, color: "text-indigo-500" },
                    { label: "Jobs Completed", value: completedJobsCount.toString(), sub: `Archived bookings`, icon: CheckCircle, color: "text-emerald-500" },
                    { label: "Staff Roster", value: staff.filter(s=>s.status==="active").length.toString(), sub: `Active dispatch pool`, icon: Users, color: "text-teal-500" },
                    { label: "Rating & Reviews", value: "4.5 / 5.0", sub: `GTB, Shell and 2 others`, icon: Star, color: "text-yellow-500" },
                  ].map((stat, i) => (
                    <Card key={i} className="hover:shadow-medium transition-smooth bg-card border-border">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <span className="text-xs font-semibold text-muted-foreground">{stat.label}</span>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                          {stat.value}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* B2B Onboarding Pending Notice banner */}
                <div className="p-5 rounded-2xl border-2 border-dashed border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl text-amber-500">
                      ⚠️
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">CAC Document Approval Pending</h4>
                      <p className="text-xs text-muted-foreground max-w-xl leading-relaxed mt-0.5">
                        Your business profile is pending standard verification check by the Connectify team. While verification is active, you are fully empowered to configure services and register your staff roster.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="text-xs border-amber-500/30 hover:bg-amber-500/10 font-bold" onClick={() => setActiveTab("settings")}>
                    Review Credentials
                  </Button>
                </div>

                {/* Quick Actions & Recent Reviews Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Quick Actions */}
                  <Card className="lg:col-span-2 bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base font-bold">B2B Core Operations Quick Actions</CardTitle>
                      <CardDescription className="text-xs">Quick access tools for manager operations</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <button onClick={() => setActiveTab("services")} className="p-4 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-smooth text-left">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white mb-3 shadow-soft">
                          <Plus className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-xs">New Service</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Configure catalog</div>
                      </button>

                      <button onClick={() => setActiveTab("leads")} className="p-4 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-smooth text-left">
                        <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white mb-3 shadow-soft">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-xs">Explore Leads</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Review bid proposals</div>
                      </button>

                      <button onClick={() => setActiveTab("dispatch")} className="p-4 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-smooth text-left">
                        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white mb-3 shadow-soft">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-xs">Roster Pool</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Add field engineers</div>
                      </button>

                      <button onClick={() => setActiveTab("jobs")} className="p-4 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-smooth text-left">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white mb-3 shadow-soft">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-xs">Job Board</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Dispatch staff</div>
                      </button>

                      <button onClick={() => setActiveTab("finances")} className="p-4 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-smooth text-left">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white mb-3 shadow-soft">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-xs">Financials</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Review payouts</div>
                      </button>

                      <button onClick={() => setActiveTab("settings")} className="p-4 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-smooth text-left">
                        <div className="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center text-white mb-3 shadow-soft">
                          <Settings className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-xs">Settings</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Company configurations</div>
                      </button>
                    </CardContent>
                  </Card>

                  {/* Rating summary */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base font-bold">Enterprise Trust Score</CardTitle>
                      <CardDescription className="text-xs">Based on B2B clients feedback</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                      <div className="inline-flex items-center gap-1.5 text-4xl font-extrabold text-yellow-500">
                        4.5
                        <Star className="w-8 h-8 fill-current text-yellow-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Excellent track record across all corporate dispatches. Outstanding response and delivery quality metrics.
                      </p>
                      <div className="border-t border-border pt-4 text-left space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>Quality Guarantee</span>
                          <span className="text-green-500">98% Satisfied</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>Dispatch SLA Match</span>
                          <span className="text-primary">95% Standard</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB 2: SERVICE MANAGEMENT */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* List of Services */}
                  <Card className="flex-1 bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">Corporate B2B Services Catalog</CardTitle>
                      <CardDescription className="text-xs">Configure your commercial services, prices, and availability.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {services.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground text-sm border border-dashed rounded-xl">
                          No corporate services registered yet. Setup your first service using the configuration form.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {services.map((service) => (
                            <div key={service.id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-foreground">{service.name}</h4>
                                  <Badge className="text-[10px] py-0 px-2 text-primary border-primary/20 bg-primary/5">{service.category}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                                <div className="flex items-center gap-3 text-xs mt-2 text-foreground font-semibold">
                                  <span>Starting from: ₦{service.startingPrice.toLocaleString()}</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                  <span className="capitalize text-muted-foreground text-[10px] font-bold px-2 py-0.5 bg-muted rounded-full">{service.pricingType} pricing</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <button
                                  onClick={() => handleToggleService(service.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-smooth ${
                                    service.isActive
                                      ? "border-green-500/30 text-green-500 bg-green-500/5 hover:bg-green-500 hover:text-white"
                                      : "border-muted-foreground/30 text-muted-foreground bg-muted hover:bg-muted-foreground hover:text-white"
                                  }`}
                                >
                                  {service.isActive ? "Active" : "Inactive"}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingService(service);
                                    toast.info("Select to edit service configuration (MVP placeholder)");
                                  }}
                                  className="p-2 rounded-lg hover:bg-muted border border-border text-muted-foreground hover:text-foreground"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Add Service Form */}
                  <Card className="w-full md:w-80 shrink-0 bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Create B2B Service</CardTitle>
                      <CardDescription className="text-xs">Add new service to catalog</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleAddService}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="s_name" className="text-xs">Service Name</Label>
                          <Input
                            id="s_name"
                            placeholder="E.g., Server Room AC Servicing"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            className="bg-card h-10 text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="s_cat" className="text-xs">Service Category</Label>
                          <select
                            id="s_cat"
                            value={newService.category}
                            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-xs"
                          >
                            <option value="House Cleaning">House Cleaning</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Repair Services">Repair Services</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="s_ptype" className="text-xs">Pricing Type</Label>
                          <select
                            id="s_ptype"
                            value={newService.pricingType}
                            onChange={(e) => setNewService({ ...newService, pricingType: e.target.value })}
                            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-xs"
                          >
                            <option value="fixed">Fixed Amount</option>
                            <option value="negotiable">Negotiable Pricing</option>
                            <option value="quote-based">Quotation Required</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="s_price" className="text-xs">Starting Price (₦)</Label>
                          <Input
                            id="s_price"
                            type="number"
                            placeholder="45000"
                            value={newService.startingPrice}
                            onChange={(e) => setNewService({ ...newService, startingPrice: e.target.value })}
                            className="bg-card h-10 text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="s_desc" className="text-xs">Description</Label>
                          <Textarea
                            id="s_desc"
                            placeholder="Describe details, standard scope of work, and equipment included..."
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            className="bg-card text-xs min-h-20"
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/95 text-white shadow-soft">
                          Create Commercial Catalog
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB 3: LEADS BOARD */}
            {activeTab === "leads" && (
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">B2B Commercial Service Requests</CardTitle>
                    <CardDescription className="text-xs">High-value leads and requirements dispatched by corporate clients or verified customers.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {requests.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground text-sm border border-dashed rounded-xl">
                        No active service requests matching your profile at the moment.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requests.map((req) => (
                          <div
                            key={req.id}
                            className={`p-5 rounded-2xl border-2 transition-smooth bg-card relative ${
                              req.status === "quoted"
                                ? "border-green-500/20 bg-green-500/[0.01]"
                                : "border-border shadow-soft hover:border-primary/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <h4 className="font-extrabold text-foreground text-base leading-tight">{req.clientName}</h4>
                                <span className="text-[10px] text-primary font-bold">{req.category}</span>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                req.urgency === "Emergency" || req.urgency === "Urgent"
                                  ? "bg-destructive/10 text-destructive border border-destructive/25"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {req.urgency}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                              {req.description}
                            </p>

                            <div className="space-y-2 border-t border-border pt-4 mb-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span className="truncate">{req.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>{req.dateTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Wallet className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                <span className="font-bold text-foreground">Estimated Budget: {req.budget}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {req.status === "quoted" ? (
                                <Badge className="w-full justify-center h-10 py-0 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold">
                                  Bid Submitted
                                </Badge>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => setActiveRequestForQuote(req)}
                                    className="flex-1 h-10 text-xs font-bold bg-primary hover:bg-primary/95 text-white shadow-soft"
                                  >
                                    Create B2B Quote
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleRejectRequest(req.id)}
                                    className="h-10 text-xs font-bold border-destructive/20 text-destructive hover:bg-destructive hover:text-white"
                                  >
                                    Ignore
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Send Quote Dialog Modal */}
                <Dialog open={!!activeRequestForQuote} onOpenChange={(open) => !open && setActiveRequestForQuote(null)}>
                  <DialogContent className="max-w-md bg-card border-border p-6 rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Submit Custom Business Proposal</DialogTitle>
                      <DialogDescription className="text-xs">
                        Proposing terms for {activeRequestForQuote?.clientName}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendQuote} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="q_amount">Total Bid Amount (₦)</Label>
                        <Input
                          id="q_amount"
                          type="number"
                          placeholder="E.g., 220000"
                          value={quoteForm.amount}
                          onChange={(e) => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                          className="bg-card h-11"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="q_delivery">Estimated Delivery Timeline</Label>
                        <select
                          id="q_delivery"
                          value={quoteForm.delivery}
                          onChange={(e) => setQuoteForm({ ...quoteForm, delivery: e.target.value })}
                          className="w-full h-11 px-3 rounded-lg border border-border bg-card text-sm"
                        >
                          <option value="6 hours">6 Hours</option>
                          <option value="12 hours">12 Hours</option>
                          <option value="1 day">1 Day</option>
                          <option value="2 days">2 Days</option>
                          <option value="3-5 days">3 to 5 Days</option>
                          <option value="1 week">1 Week</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="q_message">Pitch / Delivery Plan Note</Label>
                        <Textarea
                          id="q_message"
                          placeholder="Outline your team size, specialized gear, and plan to execute this task successfully..."
                          value={quoteForm.message}
                          onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                          className="min-h-24 bg-card text-xs resize-none"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="q_terms">Payment Terms / Contingencies</Label>
                        <Input
                          id="q_terms"
                          placeholder="E.g., 50% mobilization, 50% post-delivery check"
                          value={quoteForm.terms}
                          onChange={(e) => setQuoteForm({ ...quoteForm, terms: e.target.value })}
                          className="bg-card h-11"
                        />
                      </div>

                      <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setActiveRequestForQuote(null)} className="h-11">
                          Cancel
                        </Button>
                        <Button type="submit" className="h-11 px-6 font-bold bg-primary hover:bg-primary/95 text-white">
                          Submit Quotation Bid
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* TAB 4: QUOTES MANAGEMENT */}
            {activeTab === "quotes" && (
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Commercial Bids Quotations</CardTitle>
                    <CardDescription className="text-xs">History of all corporate proposals, values, and client feedback status.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {quotes.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground text-sm border border-dashed rounded-xl">
                        No quotation bids registered. Navigate to Leads Board to place bids on active requests.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {quotes.map((quote) => (
                          <div key={quote.id} className="p-5 rounded-2xl border border-border bg-muted/20 flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-extrabold text-base text-foreground">{quote.clientName}</h4>
                                <Badge className="text-[10px] uppercase font-bold py-0.5 px-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500">
                                  {quote.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-primary font-bold">Category: {quote.category}</p>
                              <div className="p-3 bg-card border border-border rounded-xl text-xs text-muted-foreground space-y-1">
                                <p className="font-bold text-foreground">Plan: {quote.message}</p>
                                <p className="text-[10px] italic">Terms: {quote.terms}</p>
                              </div>
                              <div className="flex items-center gap-4 text-xs font-semibold pt-1">
                                <span>Estimated Dispatch: {quote.deliveryTime}</span>
                              </div>
                            </div>

                            <div className="flex flex-col justify-between items-end shrink-0 gap-4 text-right">
                              <div>
                                <span className="text-[10px] text-muted-foreground block font-medium">Bidded Amount</span>
                                <span className="text-xl font-black text-foreground">₦{quote.quotedAmount.toLocaleString()}</span>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setQuotes(quotes.map(q => q.id === quote.id ? { ...q, status: "rejected" } : q));
                                    toast.info("Simulated: Client rejected quotation");
                                  }}
                                  className="h-9 text-xs font-bold text-destructive hover:bg-destructive hover:text-white"
                                  disabled={quote.status !== "pending"}
                                >
                                  Cancel Bid
                                </Button>
                                <Button
                                  onClick={() => {
                                    setQuotes(quotes.map(q => q.id === quote.id ? { ...q, status: "accepted" } : q));
                                    // Add to active jobs
                                    const job = {
                                      id: "j" + (jobs.length + 1),
                                      customer: quote.clientName,
                                      service: `B2B ${quote.category} dispatch`,
                                      status: "New",
                                      staffId: "",
                                      staffName: "Unassigned",
                                      date: "2026-06-02",
                                      price: quote.quotedAmount
                                    };
                                    setJobs([job, ...jobs]);
                                    toast.success("Simulated: Client accepted quotation! Project added to Job Dispatcher.");
                                  }}
                                  className="h-9 text-xs font-bold bg-primary hover:bg-primary/95 text-white"
                                  disabled={quote.status !== "pending"}
                                >
                                  Mock Client Accept
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TAB 5: TEAM / STAFF ROSTER */}
            {activeTab === "dispatch" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Staff Table */}
                  <Card className="flex-1 bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">B2B Technicians & Dispatch Pool</CardTitle>
                      <CardDescription className="text-xs">Manage active field agents, engineers, and supervisor profiles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Technician Name</TableHead>
                            <TableHead>Corporate Role</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {staff.map((member) => (
                            <TableRow key={member.id} className="hover:bg-muted/10">
                              <TableCell className="font-bold flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                  {member.name[0]}
                                </div>
                                {member.name}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">{member.role}</TableCell>
                              <TableCell className="text-xs font-mono">{member.phone}</TableCell>
                              <TableCell>
                                <Badge className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  member.status === "active"
                                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                    : "bg-muted text-muted-foreground"
                                }`}>
                                  {member.status === "active" ? "Active Dispatch" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <button
                                  onClick={() => handleToggleStaff(member.id)}
                                  className="text-xs font-bold text-primary hover:underline"
                                >
                                  {member.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Add Staff form */}
                  <Card className="w-full md:w-80 shrink-0 bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Register Field Agent</CardTitle>
                      <CardDescription className="text-xs">Add new operator to roster</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleAddStaff}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="st_name" className="text-xs">Staff Full Name</Label>
                          <Input
                            id="st_name"
                            placeholder="E.g., Emeka Obi"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                            className="bg-card h-10 text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="st_role" className="text-xs">Expertise Role</Label>
                          <Input
                            id="st_role"
                            placeholder="E.g., Senior AC Technician"
                            value={newStaff.role}
                            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                            className="bg-card h-10 text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="st_phone" className="text-xs">Phone Number</Label>
                          <Input
                            id="st_phone"
                            placeholder="+234 800..."
                            value={newStaff.phone}
                            onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                            className="bg-card h-10 text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="st_email" className="text-xs">Corporate Email (Optional)</Label>
                          <Input
                            id="st_email"
                            placeholder="agent@company.com"
                            value={newStaff.email}
                            onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                            className="bg-card h-10 text-xs"
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/95 text-white shadow-soft">
                          Enroll into Roster
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB 6: JOB DISPATCH BOARD */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold">B2B Work Dispatch Center</CardTitle>
                      <CardDescription className="text-xs">Assign accepted commercial bookings to active field staff and monitor progress.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Columns by status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {["New / Accepted", "Assigned / In Progress", "Completed"].map((colTitle) => {
                        const colStatuses = colTitle.includes("New")
                          ? ["New", "Accepted"]
                          : colTitle.includes("Assigned")
                            ? ["Assigned", "In Progress"]
                            : ["Completed", "Cancelled"];

                        const filteredJobs = jobs.filter(j => colStatuses.includes(j.status));

                        return (
                          <div key={colTitle} className="space-y-4">
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  colTitle.startsWith("New") ? "bg-amber-500" : colTitle.startsWith("Assigned") ? "bg-primary" : "bg-green-500"
                                }`} />
                                {colTitle}
                              </h3>
                              <Badge className="text-[10px] font-bold bg-muted text-muted-foreground">{filteredJobs.length}</Badge>
                            </div>

                            <div className="space-y-3">
                              {filteredJobs.length === 0 ? (
                                <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-xl bg-muted/10">
                                  No jobs in this category
                                </div>
                              ) : (
                                filteredJobs.map((job) => (
                                  <div key={job.id} className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-smooth shadow-soft space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                      <div>
                                        <h4 className="font-bold text-xs text-foreground line-clamp-1">{job.customer}</h4>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{job.service}</p>
                                      </div>
                                      <Badge className="text-[9px] font-bold py-0 px-2 bg-muted text-foreground">{job.status}</Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/60 pt-2.5">
                                      <div className="flex items-center gap-1 font-bold text-foreground">
                                        <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span>Agent: {job.staffName}</span>
                                      </div>
                                      <span className="font-bold text-green-500">₦{job.price.toLocaleString()}</span>
                                    </div>

                                    {/* Action Dispatches */}
                                    <div className="flex gap-2.5 pt-1">
                                      {job.status === "New" || job.status === "Accepted" ? (
                                        <Button
                                          onClick={() => setSelectedJobToAssign(job)}
                                          className="w-full h-8 text-[10px] font-bold bg-primary hover:bg-primary/95 text-white"
                                        >
                                          Dispatch Staff
                                        </Button>
                                      ) : job.status === "Assigned" ? (
                                        <Button
                                          onClick={() => handleAdvanceJobStatus(job.id, "In Progress")}
                                          className="w-full h-8 text-[10px] font-bold bg-purple-500 hover:bg-purple-600 text-white"
                                        >
                                          Start Dispatch Work
                                        </Button>
                                      ) : job.status === "In Progress" ? (
                                        <Button
                                          onClick={() => {
                                            handleAdvanceJobStatus(job.id, "Completed");
                                            // Trigger invoice
                                            const p = {
                                              id: "p" + (payments.length + 1),
                                              customer: job.customer,
                                              service: job.service,
                                              amount: job.price,
                                              date: new Date().toISOString().split('T')[0],
                                              status: "completed",
                                              invoiceRef: `INV-2026-00` + (payments.length + 5)
                                            };
                                            setPayments([p, ...payments]);
                                            toast.success("Escrow payment released successfully! Invoice generated.");
                                          }}
                                          className="w-full h-8 text-[10px] font-bold bg-green-500 hover:bg-green-600 text-white animate-pulse"
                                        >
                                          Complete Dispatch Work
                                        </Button>
                                      ) : (
                                        <Badge className="w-full justify-center h-8 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold">
                                          Dispatch Completed
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Dispatch Selector Modal */}
                <Dialog open={!!selectedJobToAssign} onOpenChange={(open) => !open && setSelectedJobToAssign(null)}>
                  <DialogContent className="max-w-sm bg-card border-border p-6 rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold">Select Dispatch Technician</DialogTitle>
                      <DialogDescription className="text-xs">
                        Assign job at {selectedJobToAssign?.customer} to a registered field operator.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2 max-h-60 overflow-y-auto pr-1">
                      {staff.filter(s => s.status === "active").map((member) => (
                        <button
                          key={member.id}
                          onClick={() => handleAssignJob(member.id)}
                          className="w-full p-3 rounded-xl border border-border bg-card hover:border-primary/50 text-left transition-smooth flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-xs text-foreground">{member.name}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{member.role}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* TAB 7: PAYOUTS & BILLINGS */}
            {activeTab === "finances" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Financial ledger metrics */}
                  <Card className="md:col-span-1 bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Corporate Wallet Status</CardTitle>
                      <CardDescription className="text-xs">Connectify escrows and active balances</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-xl space-y-1">
                        <span className="text-[10px] font-semibold text-muted-foreground">Available Corporate Balance</span>
                        <div className="text-2xl font-black text-foreground">₦{totalEarnings.toLocaleString()}</div>
                      </div>
                      <div className="p-4 bg-amber-500/[0.03] border border-amber-500/10 rounded-xl space-y-1">
                        <span className="text-[10px] font-semibold text-amber-500">Escrow Payouts (In Progress)</span>
                        <div className="text-xl font-extrabold text-foreground">₦{pendingPayments.toLocaleString()}</div>
                      </div>
                      <Button className="w-full h-11 gradient-primary text-white font-bold text-xs shadow-soft border-0">
                        Initiate Bank Settlement Transfer
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Payments list Table */}
                  <Card className="md:col-span-2 bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Commercial Invoices and Ledger</CardTitle>
                      <CardDescription className="text-xs">List of completed/pending corporate payouts. Commission deducted platform fee is 10%.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice Ref</TableHead>
                            <TableHead>B2B Customer</TableHead>
                            <TableHead>Payout date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map((p) => {
                            const platformFee = p.amount * 0.1;
                            const finalPayout = p.amount - platformFee;
                            return (
                              <TableRow key={p.id}>
                                <TableCell className="font-mono text-xs font-bold text-primary">{p.invoiceRef}</TableCell>
                                <TableCell className="text-xs font-semibold">{p.customer}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{p.date}</TableCell>
                                <TableCell className="text-xs font-extrabold text-foreground">₦{p.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-xs text-destructive">₦{platformFee.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    onClick={() => setViewInvoice({ ...p, platformFee, finalPayout })}
                                    className="h-8 text-[10px] font-bold gap-1 border-primary/20 text-primary hover:bg-primary hover:text-white"
                                  >
                                    <FileText className="w-3 h-3" />
                                    View Invoice
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>

                {/* Interactive Invoice Modal */}
                <Dialog open={!!viewInvoice} onOpenChange={(open) => !open && setViewInvoice(null)}>
                  <DialogContent className="max-w-md bg-card border-border p-6 rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold text-center">Commercial Billing Invoice</DialogTitle>
                    </DialogHeader>

                    {viewInvoice && (
                      <div className="space-y-4 py-4 text-xs">
                        <div className="flex justify-between items-center border-b border-border pb-3">
                          <div>
                            <p className="font-extrabold text-sm">{companyName}</p>
                            <p className="text-[10px] text-muted-foreground">{contactName} • Manager</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-primary">{viewInvoice.invoiceRef}</p>
                            <p className="text-[10px] text-muted-foreground">Date: {viewInvoice.date}</p>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex justify-between font-semibold text-muted-foreground">
                            <span>Client / Customer</span>
                            <span className="text-foreground">{viewInvoice.customer}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-muted-foreground">
                            <span>B2B Dispatch Service</span>
                            <span className="text-foreground">{viewInvoice.service}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-muted-foreground">
                            <span>Invoice Status</span>
                            <span className="text-green-500 capitalize">{viewInvoice.status}</span>
                          </div>
                        </div>

                        <div className="border-t border-border pt-3.5 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gross Commercial Charge</span>
                            <span className="font-bold text-foreground">₦{viewInvoice.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-destructive">
                            <span>Connectify Commission (10%)</span>
                            <span>-₦{viewInvoice.platformFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t border-border pt-2 text-sm font-black">
                            <span>Net Bank Payout Settlement</span>
                            <span className="text-green-500">₦{viewInvoice.finalPayout.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <DialogFooter>
                      <Button variant="outline" className="h-10 text-xs w-full" onClick={() => setViewInvoice(null)}>Close</Button>
                      <Button
                        className="h-10 text-xs w-full font-bold bg-primary hover:bg-primary/95 text-white gap-1.5"
                        onClick={() => {
                          toast.success("Downloading PDF Invoice file...");
                          setViewInvoice(null);
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download Invoice PDF
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* TAB 8: CLIENT REVIEWS */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Commercial Trust Reviews</CardTitle>
                    <CardDescription className="text-xs">Detailed testimonies and service feedback submitted by corporate clients and booking representatives.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-border bg-card space-y-2 shadow-soft">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-xs text-foreground">{rev.clientName}</h4>
                            <span className="text-[10px] text-muted-foreground">Date: {rev.date}</span>
                          </div>

                          <div className="flex gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current text-yellow-500" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TAB 9: SETTINGS & CORPORATE PROFILE */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Settings form */}
                  <Card className="flex-1 bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">B2B Corporate Profile Settings</CardTitle>
                      <CardDescription className="text-xs">Modify operational location, email triggers, and commercial settings.</CardDescription>
                    </CardHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      toast.success("Corporate settings updated successfully");
                    }}>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="set_company">Company Registered Name</Label>
                            <Input id="set_company" value={formData.companyName} onChange={handleInputChange} className="bg-card h-11" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="set_contact">Corporate Representative (Admin)</Label>
                            <Input id="set_contact" value={formData.contactName} onChange={handleInputChange} className="bg-card h-11" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="set_email">Corporate Representative Email</Label>
                            <Input id="set_email" type="email" value={formData.companyEmail} onChange={handleInputChange} className="bg-card h-11" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="set_phone">Business Representative Phone</Label>
                            <Input id="set_phone" value={formData.companyPhone} onChange={handleInputChange} className="bg-card h-11" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="set_address">Headquarters Corporate Address</Label>
                          <Input id="set_address" value={formData.businessAddress} onChange={handleInputChange} className="bg-card h-11" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="set_op_loc">Corporate Operating Locations</Label>
                          <Input id="set_op_loc" value={formData.operatingLocations} onChange={handleInputChange} className="bg-card h-11" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="set_team">Roster Team Size Range</Label>
                            <select id="set_team" value={formData.teamSize} onChange={handleInputChange} className="w-full h-11 px-3 rounded-lg border border-border bg-card text-sm">
                              <option value="2-5">2 to 5 employees</option>
                              <option value="6-15">6 to 15 employees</option>
                              <option value="16-50">16 to 50 employees</option>
                              <option value="50+">More than 50 employees</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="set_cac">CAC Number Identification</Label>
                            <Input id="set_cac" value={formData.cacNumber} onChange={handleInputChange} className="bg-card h-11" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-border pt-4">
                        <Button type="submit" className="h-11 px-8 font-bold bg-primary hover:bg-primary/95 text-white">
                          Save Corporate Details
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>

                  {/* Help Support Panel */}
                  <Card className="w-full md:w-80 shrink-0 bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">B2B Support Channel</CardTitle>
                      <CardDescription className="text-xs">Direct manager ticket escalation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs text-muted-foreground">
                      <p>
                        Need assistance with a corporate escrow dispute, staff account issue, or high-value contract bid? File a priority manager ticket.
                      </p>
                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <Label className="text-[10px]">Escalation Category</Label>
                          <select className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs">
                            <option>Payment & Escrow Disputes</option>
                            <option>Corporate Document Review</option>
                            <option>API & Platform Issues</option>
                            <option>Other Support Cases</option>
                          </select>
                        </div>
                        <Textarea placeholder="Explain your concern in detail..." className="bg-card text-xs min-h-16 resize-none" />
                        <Button
                          onClick={() => {
                            toast.success("B2B support ticket submitted successfully! A manager will reach out.");
                          }}
                          className="w-full h-9 text-[10px] font-bold bg-primary hover:bg-primary/95 text-white shadow-soft"
                        >
                          Submit Escaped Case Ticket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyDashboard;
