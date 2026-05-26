import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Briefcase, 
  Plus, 
  Search, 
  MoreVertical, 
  ExternalLink, 
  Trash2,
  Tag,
  Star
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
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const ServiceManagement = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: servicesData, isLoading, isError } = useQuery({
    queryKey: ['admin-services', search],
    queryFn: async () => {
      const response = await api.services.get({ search });
      return response.data?.data || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.services.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service listing removed');
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Moderation</h1>
          <p className="text-muted-foreground">Monitor and manage all service listings published on the platform.</p>
        </div>
        <Button size="sm" className="gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-4 bg-muted/20 border-b flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Filter services by title, category, or provider..." 
              className="pl-10 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Service</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                [1,2,3,4,5].map(i => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : isError ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-destructive">
                        Services could not be loaded. Please check the backend connection and try again.
                    </TableCell>
                </TableRow>
            ) : (servicesData || []).length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Briefcase className="w-12 h-12 opacity-20 mb-2" />
                            <p>No services found matching your search</p>
                        </div>
                    </TableCell>
                </TableRow>
            ) : (
                servicesData.map((s: any) => (
                    <TableRow key={s._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                            <div className="flex flex-col max-w-[250px]">
                                <span className="font-medium truncate">{s.name || s.title}</span>
                                <span className="text-xs text-muted-foreground line-clamp-1">{s.description}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                            {s.provider?.name || 'User'}
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="flex items-center w-fit bg-background">
                                <Tag className="w-3 h-3 mr-1 text-primary" />
                                {s.category || 'General'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                            ₦{s.price?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full w-fit border border-amber-100">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs font-bold">{s.rating?.average || 0}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <ExternalLink className="w-4 h-4 mr-2" /> View Listing
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive focus:bg-destructive/5"
                                        onClick={() => deleteMutation.mutate(s._id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Listing
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ServiceManagement;
