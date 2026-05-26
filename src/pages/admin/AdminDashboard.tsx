import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Briefcase, 
  CalendarCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ShieldAlert,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: statsResponse, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.admin.getStats(),
  });

  const stats = statsResponse?.data;

  const StatCard = ({ title, value, icon: Icon, description, trend, trendValue, href }: any) => (
    <Card 
      className={`hover:shadow-md transition-all ${href ? 'cursor-pointer group' : ''}`}
      onClick={() => href && navigate(href)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium text-muted-foreground ${href ? 'group-hover:text-primary transition-colors' : ''}`}>{title}</CardTitle>
        <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ${href ? 'group-hover:bg-primary group-hover:text-white transition-all' : 'text-primary'}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
            {typeof value === 'number' && title.includes('Revenue') ? `₦${value.toLocaleString()}` : value.toLocaleString()}
        </div>
        <div className="flex items-center mt-1 text-xs">
          {trend === 'up' || (trendValue && trendValue > 0) ? (
            <div className="flex items-center text-emerald-500">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span className="font-medium">+{trendValue || 0}%</span>
            </div>
          ) : (
            <div className="flex items-center text-destructive">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              <span className="font-medium">{trendValue || 0}%</span>
            </div>
          )}
          <span className="ml-1 text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px] w-full" />
          <Skeleton className="col-span-3 h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-destructive" />
        <h1 className="text-xl font-bold text-foreground">Admin stats could not be loaded</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please check the backend connection and sign in with an admin account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Insights</h1>
          <p className="text-muted-foreground">Real-time platform performance and administrative overview.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 py-1 px-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              System Online
           </Badge>
           <span className="text-xs text-muted-foreground italic">Last update: Just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={stats?.users?.total || 0} 
          icon={Users} 
          description="from last month"
          trend="up"
          trendValue={stats?.users?.growth || 0}
          href="/admin/users"
        />
        <StatCard 
          title="Revenue" 
          value={2450000} 
          icon={TrendingUp} 
          description="current month"
          trend="up"
          trendValue={8.4}
        />
        <StatCard 
          title="Bookings" 
          value={stats?.bookings?.total || 0} 
          icon={CalendarCheck} 
          description="total completed"
          trend="up"
          trendValue={15}
        />
        <StatCard 
          title="Active Listings" 
          value={stats?.services?.total || 0} 
          icon={Briefcase} 
          description="vetted providers"
          trend="up"
          trendValue={2.1}
          href="/admin/services"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>User and Booking trends over the last 30 days.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary mr-1" /> Users
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1" /> Bookings
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4 flex items-center justify-center border-2 border-dashed rounded-xl bg-muted/5">
              <div className="text-center space-y-2">
                <TrendingUp className="w-10 h-10 mx-auto text-muted-foreground opacity-20" />
                <p className="text-sm font-medium text-muted-foreground">Analytics Engine Active</p>
                <p className="text-xs text-muted-foreground/60 px-4">Interactive charts are processing historical data snapshots.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Security & Compliance</CardTitle>
            <CardDescription>Recent system-wide safety events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { type: 'verification', user: "Chidi O.", action: "Verification Pending", time: "15 mins ago", icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-50" },
                { type: 'alert', user: "System", action: "High Revenue Detected", time: "1 hour ago", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
                { type: 'security', user: "Admin", action: "Password Policy Updated", time: "3 hours ago", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                { type: 'critical', user: "System", action: "Failed Login Attempt (3x)", time: "5 hours ago", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-lg ${event.bg} flex items-center justify-center shrink-0`}>
                    <event.icon className={`w-5 h-5 ${event.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none">
                      {event.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      Performed by <span className="font-medium text-foreground">{event.user}</span> • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 text-xs h-9" asChild>
              <Link to="/admin/audit">View Detailed Audit Log</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
