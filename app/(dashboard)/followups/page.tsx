"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, Eye, Loader2, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface FollowUp {
  id: string;
  dueAt: string;
  notes: string | null;
  type: string;
  completed: boolean;
  completedAt: string | null;
  lead: { businessName: string; city: string; category: string; status: string };
}

function isOverdue(dueAt: string) {
  return new Date(dueAt) < new Date();
}

export default function FollowUpsPage() {
  const [upcoming, setUpcoming] = useState<FollowUp[]>([]);
  const [all, setAll] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFollowUps = useCallback(async () => {
    setLoading(true);
    try {
      const [upRes, allRes] = await Promise.all([
        fetch("/api/followups?upcoming=true"),
        fetch("/api/followups"),
      ]);
      setUpcoming(await upRes.json());
      setAll(await allRes.json());
    } catch {
      toast({ title: "Error loading follow-ups", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchFollowUps(); }, [fetchFollowUps]);

  const complete = async (id: string) => {
    const res = await fetch("/api/followups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: true }),
    });
    if (res.ok) { toast({ title: "Follow-up completed!" }); fetchFollowUps(); }
  };

  const FollowUpCard = ({ fu }: { fu: FollowUp }) => (
    <Card className={`${isOverdue(fu.dueAt) && !fu.completed ? "border-red-200 bg-red-50" : ""}`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-medium text-gray-900">{fu.lead.businessName}</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{fu.lead.status}</span>
              {isOverdue(fu.dueAt) && !fu.completed && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Overdue</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{fu.lead.category} · {fu.lead.city}</p>
            {fu.notes && <p className="text-sm text-gray-600 mt-1">{fu.notes}</p>}
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>Due: <strong className={isOverdue(fu.dueAt) && !fu.completed ? "text-red-600" : "text-gray-700"}>{formatDate(fu.dueAt)}</strong></span>
              <span>· {fu.type}</span>
            </div>
            {fu.completed && fu.completedAt && (
              <p className="text-xs text-green-600 mt-1">✓ Completed {formatDate(fu.completedAt)}</p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/crm/${fu.lead}`}><Eye className="h-4 w-4" /></Link>
            </Button>
            {!fu.completed && (
              <Button size="sm" onClick={() => complete(fu.id)}>
                <Check className="mr-1 h-4 w-4" />Done
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;

  const pending = all.filter(f => !f.completed);
  const completed = all.filter(f => f.completed);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Follow-Ups</h1>
        <p className="text-gray-600 mt-1">Track and manage your follow-up reminders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{upcoming.length}</div>
            <div className="text-sm text-gray-500">Due This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{pending.length}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{completed.length}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Due This Week ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="all">All Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-200" />
              <p>No follow-ups due this week</p>
            </div>
          ) : (
            upcoming.map(fu => <FollowUpCard key={fu.id} fu={fu} />)
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4 space-y-3">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No pending follow-ups</div>
          ) : (
            pending.map(fu => <FollowUpCard key={fu.id} fu={fu} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-3">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No completed follow-ups</div>
          ) : (
            completed.map(fu => <FollowUpCard key={fu.id} fu={fu} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
