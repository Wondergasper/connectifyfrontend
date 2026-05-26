import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Star, 
  Search, 
  MoreVertical, 
  Trash2, 
  MessageSquare,
  User,
  Clock
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
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const ReviewManagement = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['admin-reviews', search],
    queryFn: async () => {
      const response = await api.reviews.getAll({ search });
      return response.data || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.reviews.delete(id),
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review Management</h1>
        <p className="text-muted-foreground">Monitor platform feedback and moderate user reviews.</p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-4 bg-muted/20 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search reviews or users..." 
              className="pl-10 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Reviewer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="max-w-xs">Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                [1,2,3].map(i => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-64" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : (reviewsData || []).length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center text-muted-foreground">
                        No reviews found.
                    </TableCell>
                </TableRow>
            ) : (
                reviewsData.map((r: any) => (
                    <TableRow key={r._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-sm">{r.customer?.name || 'Unknown customer'}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-sm">{r.service?.name || 'Unknown service'}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-0.5 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate italic text-muted-foreground">
                            "{r.comment}"
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <MessageSquare className="w-4 h-4 mr-2" /> Contact User
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => deleteMutation.mutate(r._id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Review
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

export default ReviewManagement;
