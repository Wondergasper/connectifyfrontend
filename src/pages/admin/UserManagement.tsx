import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  Trash2, 
  Mail,
  Phone,
  ArrowUpDown,
  ExternalLink,
  Users,
  Download,
  AlertTriangle,
  UserX,
  UserCheck
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from "@/components/ui/checkbox";
import { api } from '@/lib/api';
import { toast } from 'sonner';

import { Link } from 'react-router-dom';

const UserManagement = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userToSuspend, setUserToSuspend] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, isError } = useQuery({
    queryKey: ['admin-users', search, roleFilter],
    queryFn: async () => {
      const response = await api.users.getAll();
      return response.data || [];
    }
  });

  const suspendMutation = useMutation({
    mutationFn: (userId: string) => api.users.update(userId, { isActive: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User account has been suspended');
      setUserToSuspend(null);
    }
  });

  const filteredUsers = (usersData || []).filter((u: any) => {
    const matchesSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((u: any) => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkSuspend = () => {
    toast.promise(
      Promise.all(selectedUsers.map(id => api.users.update(id, { isActive: false }))),
      {
        loading: 'Suspending selected users...',
        success: 'Successfully suspended selected accounts',
        error: 'Failed to suspend some accounts',
      }
    );
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Comprehensive control over system accounts, roles, and safety.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="h-9">
              <Download className="w-4 h-4 mr-2" />
              Export Records
           </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        {/* Advanced Filter Bar */}
        <div className="p-4 bg-muted/20 border-b space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, or unique ID..." 
                className="pl-10 bg-background border-muted-foreground/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <Button 
                  variant={roleFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  className="rounded-full h-8 px-4"
                  onClick={() => setRoleFilter('all')}
              >All Users</Button>
              <Button 
                  variant={roleFilter === 'provider' ? 'default' : 'outline'} 
                  size="sm"
                  className="rounded-full h-8 px-4"
                  onClick={() => setRoleFilter('provider')}
              >Providers</Button>
              <Button 
                  variant={roleFilter === 'customer' ? 'default' : 'outline'} 
                  size="sm"
                  className="rounded-full h-8 px-4"
                  onClick={() => setRoleFilter('customer')}
              >Customers</Button>
            </div>
          </div>

          {/* Bulk Action Bar */}
          {selectedUsers.length > 0 && (
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-2 flex items-center justify-between animate-in slide-in-from-top-2">
              <div className="flex items-center gap-3 ml-2">
                <span className="text-sm font-medium text-primary">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={handleBulkSuspend}>
                  <UserX className="w-4 h-4 mr-2" /> Suspend Selected
                </Button>
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">
                  <UserCheck className="w-4 h-4 mr-2" /> Reactivate
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Mail className="w-4 h-4 mr-2" /> Send Batch Email</DropdownMenuItem>
                    <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Export Selected</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead>User Identity</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                [1,2,3,4,5].map(i => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                        <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : isError ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-destructive">
                        Users could not be loaded. Please check the backend connection and try again.
                    </TableCell>
                </TableRow>
            ) : filteredUsers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-72 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Search className="w-8 h-8 text-muted-foreground opacity-20" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">No results found</h3>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    We couldn't find any users matching "{search}". Try checking your spelling or using different filters.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => {setSearch(''); setRoleFilter('all');}}>
                                Clear all filters
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            ) : (
                filteredUsers.map((u: any) => (
                    <TableRow key={u._id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <Checkbox 
                            checked={selectedUsers.includes(u._id)}
                            onCheckedChange={(checked) => handleSelectUser(u._id, !!checked)}
                          />
                        </TableCell>
                        <TableCell>
                            <Link to={`/admin/users/${u._id}`} className="flex items-center gap-3 hover:underline underline-offset-4 decoration-primary/30">
                                <Avatar className="h-10 w-10 border shadow-sm group-hover:border-primary/30 transition-colors">
                                    <AvatarImage src={u.profile?.avatar} />
                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">{(u.name || 'U').charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{u.name}</span>
                                    <span className="text-xs text-muted-foreground">{u.email}</span>
                                </div>
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Badge variant={u.role === 'provider' ? 'secondary' : 'outline'} className="capitalize font-medium">
                                {u.role}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge 
                              variant={u.isActive !== false ? 'outline' : 'destructive'} 
                              className={u.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200 capitalize' : 'capitalize'}
                            >
                                {u.isActive !== false ? 'Active' : 'Suspended'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                            {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52">
                                    <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link to={`/admin/users/${u._id}`} className="w-full flex items-center">
                                            <ExternalLink className="w-4 h-4 mr-2" /> Profile Overview
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Phone className="w-4 h-4 mr-2" /> Contact Record
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {u.isActive !== false ? (
                                        <DropdownMenuItem 
                                            className="text-destructive focus:text-destructive focus:bg-destructive/5"
                                            onClick={() => setUserToSuspend(u)}
                                        >
                                            <Ban className="w-4 h-4 mr-2" /> Suspend Account
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem 
                                            className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                                            onClick={() => api.users.update(u._id, { isActive: true }).then(() => queryClient.invalidateQueries({ queryKey: ['admin-users'] }))}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" /> Reactivate Account
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Suspension Safety Modal */}
      <AlertDialog open={!!userToSuspend} onOpenChange={() => setUserToSuspend(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle>Suspend {userToSuspend?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately restrict the user's access to the platform. 
              {userToSuspend?.role === 'provider' && ' All active service listings for this provider will be hidden.'}
              This action can be reversed by an administrator later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => suspendMutation.mutate(userToSuspend?._id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Suspension
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
