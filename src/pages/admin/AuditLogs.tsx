import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  Search, 
  User, 
  ShieldAlert, 
  Briefcase, 
  Trash2, 
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

const getLogVisual = (action = '') => {
  const normalized = action.toLowerCase();
  if (normalized.includes('delete') || normalized.includes('reject') || normalized.includes('remove')) {
    return { icon: Trash2, color: 'text-destructive', bg: 'bg-destructive/10' };
  }
  if (normalized.includes('approve') || normalized.includes('added')) {
    return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' };
  }
  if (normalized.includes('user')) {
    return { icon: User, color: 'text-blue-500', bg: 'bg-blue-50' };
  }
  return { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' };
};

const AuditLogs = () => {
  const [search, setSearch] = useState('');
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs', search],
    queryFn: async () => {
      const response = await api.admin.getAuditLogs({ search });
      return response.data || [];
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
          <p className="text-muted-foreground">Trace every administrative action performed on the platform.</p>
        </div>
        <Button variant="outline" size="sm">
          <Clock className="w-4 h-4 mr-2" />
          Real-time Feed
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-4 bg-muted/20 border-b flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by admin name, action, or target..." 
              className="pl-10 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Event</TableHead>
              <TableHead>Administrator</TableHead>
              <TableHead>Target Entity</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Reference ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Loading audit events...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No audit events found.
                </TableCell>
              </TableRow>
            ) : logs.map((log: any) => {
              const visual = getLogVisual(log.action);
              const Icon = visual.icon;
              return (
              <TableRow key={log._id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${visual.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${visual.color}`} />
                    </div>
                    <span className="font-semibold text-sm">{log.action}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium">{log.actorName || log.actor?.name || 'System'}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    {log.target || log.entityType}
                  </code>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground italic">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Just now'}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-xs font-mono text-muted-foreground">#REF-{String(log._id).slice(-6).toUpperCase()}</span>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </Card>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
        <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Retention Policy</p>
          <p>Audit logs are retained for 365 days for regulatory compliance. Older records are archived to cold storage.</p>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
