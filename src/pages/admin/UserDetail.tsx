import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Wallet,
  MessageSquare,
  Ban,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['admin-user-summary', id],
    queryFn: async () => {
      const response = await api.admin.getUserSummary(id!);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading user details...</div>;
  }

  const user = summary?.user;
  const stats = summary?.stats || {};
  const recentBookings = summary?.recentBookings || [];
  const recentTransactions = summary?.recentTransactions || [];

  if (!user) {
    return <div className="p-6 text-muted-foreground">User not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">User Deep-Dive</h1>
        <Badge variant={user.isActive ? 'outline' : 'destructive'} className={user.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
          {user.isActive ? 'Active Member' : 'Suspended'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                <AvatarImage src={user.profile?.avatar} />
                <AvatarFallback className="text-2xl font-bold">{(user.name || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><Mail className="w-4 h-4 mr-2" /> Email</Button>
                <Button size="sm" variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
              </div>
            </div>
            <div className="mt-8 space-y-4 border-t pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{user.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{user.profile?.location?.address || 'No location added'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground font-medium">{user.role === 'provider' ? 'Total Earned' : 'Total Spent'}</p>
                <p className="text-2xl font-bold">NGN {(stats.totalEarned || stats.totalSpent || 0).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground font-medium">Bookings</p>
                <p className="text-2xl font-bold">{stats.bookings || 0}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground font-medium">Wallet Balance</p>
                <p className="text-2xl font-bold">NGN {(stats.walletBalance || 0).toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm">
            <Tabs defaultValue="activity" className="w-full">
              <CardHeader className="pb-0">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="activity">Booking History</TabsTrigger>
                  <TabsTrigger value="wallet">Transactions</TabsTrigger>
                  <TabsTrigger value="logs">Reviews</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="activity" className="mt-0">
                  <div className="space-y-4">
                    {recentBookings.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-10">No booking history yet.</p>
                    ) : recentBookings.map((booking: any) => (
                      <div key={booking._id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{booking.service?.name || 'Service booking'}</p>
                            <p className="text-xs text-muted-foreground">
                              {booking.date ? new Date(booking.date).toLocaleDateString() : 'No date'} - NGN {(booking.totalAmount || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">{booking.status}</Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="wallet" className="mt-0">
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <Wallet className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p>No transaction history yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentTransactions.map((tx: any) => (
                        <div key={tx._id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                          <div>
                            <p className="text-sm font-semibold">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ''}</p>
                          </div>
                          <p className="text-sm font-bold">NGN {(tx.amount || 0).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="logs" className="mt-0">
                  <div className="space-y-3">
                    {(summary?.recentReviews || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-10">No reviews yet.</p>
                    ) : summary.recentReviews.map((review: any) => (
                      <div key={review._id} className="p-3 rounded-lg border bg-muted/20">
                        <p className="text-sm font-semibold">{review.service?.name || 'Service review'} - {review.rating}/5</p>
                        <p className="text-xs text-muted-foreground mt-1">{review.comment || 'No comment'}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20">
              <Ban className="w-4 h-4 mr-2" />
              Suspend Account
            </Button>
            <Button className="gradient-primary">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
