"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Phone, Globe, MessageSquare, Bell, StickyNote } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Lead {
  id: string;
  businessName: string;
  category: string;
  city: string;
  country: string;
  phone: string | null;
  website: string | null;
  email: string | null;
  status: string;
  opportunity: string;
  opportunityScore: number;
  hasWebsite: boolean;
  createdAt: string;
  _count: { notes: number; messages: number; followUps: number };
}

const KANBAN_STATUSES = ["NEW", "CONTACTED", "REPLIED", "QUALIFIED", "CLOSED"];

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  REPLIED: "Replied",
  QUALIFIED: "Qualified",
  CLOSED: "Closed",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "border-t-blue-400",
  CONTACTED: "border-t-yellow-400",
  REPLIED: "border-t-green-400",
  QUALIFIED: "border-t-purple-400",
  CLOSED: "border-t-gray-400",
};

const OPP_COLORS: Record<string, string> = {
  HIGH: "text-green-600 bg-green-50",
  MEDIUM: "text-yellow-600 bg-yellow-50",
  LOW: "text-red-600 bg-red-50",
};

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100", ...(search && { search }) });
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      toast({ title: "Error loading CRM data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      toast({ title: "Status updated" });
    }
  };

  const byStatus = (status: string) => leads.filter(l => l.status === status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-600 mt-1">Manage your lead pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "kanban" ? "default" : "outline"} size="sm" onClick={() => setView("kanban")}>Kanban</Button>
          <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>List</Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search leads..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : view === "kanban" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
          {KANBAN_STATUSES.map(status => (
            <div key={status} className="min-w-[220px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-gray-700">{STATUS_LABELS[status]}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{byStatus(status).length}</span>
              </div>
              <div className="space-y-2">
                {byStatus(status).map(lead => (
                  <div key={lead.id} className={`bg-white border-t-4 ${STATUS_COLORS[status]} rounded-lg border p-3 shadow-sm`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm text-gray-900 leading-tight">{lead.businessName}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ml-1 flex-shrink-0 ${OPP_COLORS[lead.opportunity]}`}>
                        {lead.opportunityScore}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{lead.category} · {lead.city}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      {lead._count.messages > 0 && <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{lead._count.messages}</span>}
                      {lead._count.notes > 0 && <span className="flex items-center gap-0.5"><StickyNote className="h-3 w-3" />{lead._count.notes}</span>}
                      {lead._count.followUps > 0 && <span className="flex items-center gap-0.5"><Bell className="h-3 w-3" />{lead._count.followUps}</span>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="text-xs h-7 flex-1" asChild>
                        <Link href={`/dashboard/crm/${lead.id}`}><Eye className="h-3 w-3 mr-1" />View</Link>
                      </Button>
                      <Select value={lead.status} onValueChange={v => updateStatus(lead.id, v)}>
                        <SelectTrigger className="h-7 text-xs w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {KANBAN_STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                {byStatus(status).length === 0 && (
                  <div className="text-center py-8 text-gray-300 text-xs border-2 border-dashed rounded-lg">No leads</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map(lead => (
            <Card key={lead.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{lead.businessName}</p>
                    <p className="text-sm text-gray-500">{lead.category} · {lead.city}, {lead.country}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>{lead._count.messages} msgs</span>
                      <span>{lead._count.notes} notes</span>
                      <span>{lead._count.followUps} follow-ups</span>
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${OPP_COLORS[lead.opportunity]}`}>{lead.opportunity}</span>
                    <Select value={lead.status} onValueChange={v => updateStatus(lead.id, v)}>
                      <SelectTrigger className="h-8 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {KANBAN_STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/crm/${lead.id}`}><Eye className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {leads.length === 0 && (
            <div className="text-center py-12 text-gray-500">No leads found</div>
          )}
        </div>
      )}
    </div>
  );
}
