import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Check, 
  X, 
  Eye,
  User as UserIcon,
  Briefcase,
  FileText,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VerificationCenter = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('professional');
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ['admin-verifications', activeTab],
    queryFn: async () => {
      const type = activeTab === 'identity' ? 'kyc' : 'professional';
      const response = await api.verification.getAll({ status: 'pending', type });
      return response.data || [];
    }
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.verification.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
      toast.success('Verification approved successfully');
      setSelectedRequest(null);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => api.verification.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
      toast.success('Verification rejected');
      setSelectedRequest(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const getRequestUser = (request: any) => request?.user || request?.userId || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trust & Safety Center</h1>
          <p className="text-muted-foreground">Manage platform integrity through KYC and Professional audits.</p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Auto-vetting Active
            </Badge>
        </div>
      </div>

      <Tabs defaultValue="professional" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="professional" className="flex gap-2">
            <Briefcase className="w-4 h-4" />
            Vendors <Badge className="ml-1 h-5 px-1.5 bg-primary/20 text-primary border-none">{activeTab === 'professional' ? requests.length : 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="identity" className="flex gap-2">
            <UserIcon className="w-4 h-4" />
            Identity <Badge className="ml-1 h-5 px-1.5 bg-primary/20 text-primary border-none">{activeTab === 'identity' ? requests.length : 0}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="professional" className="mt-6 space-y-4">
            <Card className="border-none shadow-sm overflow-hidden">
                <div className="p-4 bg-muted/20 border-b flex justify-between items-center">
                    <h3 className="text-sm font-semibold">Pending Vendor Applications</h3>
                    <Button variant="ghost" size="sm" className="text-xs text-primary">View History</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Vendor</TableHead>
                            <TableHead>Specialization</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? <TableSkeleton /> : isError ? (
                            <TableError colSpan={5} />
                        ) : requests.length === 0 ? (
                            <TableEmpty colSpan={5} label="No pending vendor applications" />
                        ) : requests.map((req: any) => {
                          const requestUser = getRequestUser(req);
                          return (
                            <TableRow key={req._id} className="hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {(requestUser?.name || 'U').charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">{requestUser?.name || 'Unknown user'}</span>
                                            <span className="text-xs text-muted-foreground">{requestUser?.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal">{requestUser?.providerDetails?.category || req.documentType}</Badge>
                                </TableCell>
                                <TableCell className="text-sm font-medium">{requestUser?.providerDetails?.yearsOfExperience ? `${requestUser.providerDetails.yearsOfExperience} Years` : 'Not provided'}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        <span className="text-xs font-medium text-amber-600 uppercase tracking-tighter">Needs Review</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline" className="h-8 shadow-sm" onClick={() => setSelectedRequest(req)}>
                                                Audit Docs
                                            </Button>
                                        </DialogTrigger>
                                        <VerificationModalContent 
                                            request={selectedRequest} 
                                            onApprove={() => approveMutation.mutate(selectedRequest._id)}
                                            onReject={(reason) => rejectMutation.mutate({ id: selectedRequest._id, reason })}
                                        />
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </Card>
        </TabsContent>

        <TabsContent value="identity" className="mt-6 space-y-4">
             <Card className="border-none shadow-sm overflow-hidden">
                <div className="p-4 bg-muted/20 border-b">
                    <h3 className="text-sm font-semibold">Customer KYC Queue</h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>User</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Submission Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? <TableSkeleton /> : isError ? (
                            <TableError colSpan={4} />
                        ) : requests.length === 0 ? (
                            <TableEmpty colSpan={4} label="No pending identity checks" />
                        ) : (requests || []).map((req: any) => {
                          const requestUser = getRequestUser(req);
                          return (
                             <TableRow key={req._id} className="hover:bg-muted/30">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><UserIcon className="w-4 h-4 text-muted-foreground" /></div>
                                        <span className="text-sm font-medium">{requestUser?.name || 'Unknown'}</span>
                                    </div>
                                </TableCell>
                                <TableCell><span className="text-xs uppercase font-bold text-muted-foreground">{req.documentType || 'ID Verification'}</span></TableCell>
                                <TableCell className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline" onClick={() => setSelectedRequest(req)}>Review KYC</Button>
                                        </DialogTrigger>
                                        <VerificationModalContent 
                                            request={selectedRequest} 
                                            onApprove={() => approveMutation.mutate(selectedRequest._id)}
                                            onReject={(reason) => rejectMutation.mutate({ id: selectedRequest._id, reason })}
                                        />
                                    </Dialog>
                                </TableCell>
                             </TableRow>
                        )})}
                    </TableBody>
                </Table>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const VerificationModalContent = ({ request, onApprove, onReject }: any) => {
    const [reason, setReason] = useState('');
    const requestUser = request?.user || request?.userId || {};
    const documents = request?.documents || [
        request?.documentFront && { type: request?.documentType || 'Front document', url: request.documentFront, status: request?.status },
        request?.documentBack && { type: 'Back document', url: request.documentBack, status: request?.status },
    ].filter(Boolean);

    return (
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Verification Audit: {requestUser?.name || 'Applicant'}
                </DialogTitle>
                <DialogDescription>
                    Manually vetting {request?.documentType || (request?.type === 'professional' ? 'Vendor Credentials' : 'Identity Documents')}.
                </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                {/* Left: Metadata */}
                <div className="space-y-4 col-span-1 border-r pr-6">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Platform ID</p>
                        <code className="text-xs bg-muted p-1 rounded">
                            USR-{(requestUser?._id || requestUser?.id || 'PENDING').slice(-6).toUpperCase()}
                        </code>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Risk Score</p>
                        <div className="flex items-center gap-2">
                             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[85%]" />
                             </div>
                             <span className="text-xs font-bold">Low</span>
                        </div>
                    </div>
                    <div className="pt-4 border-t space-y-3">
                         <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                            <MessageSquare className="w-3.5 h-3.5 mr-2" /> Message User
                         </Button>
                         <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8 text-destructive hover:text-destructive">
                            <AlertCircle className="w-3.5 h-3.5 mr-2" /> Flag for Fraud
                         </Button>
                    </div>
                </div>

                {/* Right: Document List */}
                <div className="md:col-span-2 space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Evidence Files
                    </h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {documents.length === 0 ? (
                            <div className="p-4 border rounded-xl bg-muted/30 text-sm text-muted-foreground">
                                No uploaded evidence files were attached to this request.
                            </div>
                        ) : documents.map((doc: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-xl bg-card hover:border-primary/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">{doc.type || `Document ${i+1}`}</p>
                                        <p className="text-[10px] text-muted-foreground">Uploaded {new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {doc.status === 'verified' ? (
                                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 h-6">Verified</Badge>
                                    ) : (
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" asChild>
                                            <a href={doc.url} target="_blank" rel="noreferrer">
                                            <Eye className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <textarea
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Reason for rejection, if needed"
                        className="w-full min-h-20 rounded-xl border border-border bg-background p-3 text-sm text-foreground"
                    />
                </div>
            </div>

            <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-6 rounded-b-xl border-t gap-3 sm:gap-0">
                <Button
                    variant="outline"
                    className="text-destructive border-destructive/20 hover:bg-destructive hover:text-white px-6"
                    onClick={() => onReject(reason.trim() || 'Rejected by admin review')}
                >
                    <X className="w-4 h-4 mr-2" /> Reject Application
                </Button>
                <Button className="gradient-primary px-8" onClick={onApprove}>
                    <Check className="w-4 h-4 mr-2" /> Final Approval
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

const TableSkeleton = () => (
    [1,2,3].map(i => (
        <TableRow key={i}>
            <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
            <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
        </TableRow>
    ))
);

const TableEmpty = ({ colSpan, label }: { colSpan: number; label: string }) => (
    <TableRow>
        <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
            {label}
        </TableCell>
    </TableRow>
);

const TableError = ({ colSpan }: { colSpan: number }) => (
    <TableRow>
        <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-destructive">
            Verification requests could not be loaded. Please check the backend connection and try again.
        </TableCell>
    </TableRow>
);

export default VerificationCenter;
