"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Globe, Phone, Mail, MapPin, Star, ChevronLeft,
  ChevronRight, Trash2, Eye, TrendingUp,
} from "lucide-react";
import Link from "next/link";
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
  rating: number | null;
  status: string;
  opportunity: string;
  opportunityScore: number;
  hasWebsite: boolean;
  createdAt: string;
  _count: { notes: number; messages: number; followUps: number };
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  REPLIED: "bg-green-100 text-green-700",
  QUALIFIED: "bg-purple-100 text-purple-700",
  CLOSED: "bg-gray-100 text-gray-700",
};

const OPPORTUNITY_COLORS: Record<string, string> = {
  HIGH: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-red-100 text-red-700",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [opportunityFilter, setOpportunityFilter] = useState("all");
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(opportunityFilter !== "all" && { opportunity: opportunityFilter }),
      });
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast({ title: "Error loading leads", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, opportunityFilter, toast]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Lead deleted" });
      fetchLeads();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Leads</h1>
          <p className="text-gray-600 mt-1">{total} leads total</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/leads/finder">Find More Leads</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="REPLIED">Replied</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={opportunityFilter} onValueChange={(v) => { setOpportunityFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Opportunity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Opportunities</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No leads found</p>
              <p className="text-sm">Try adjusting your filters or find new leads.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900">{lead.businessName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${OPPORTUNITY_COLORS[lead.opportunity]}`}>
                        {lead.opportunity}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {lead.city}, {lead.country}
                      </span>
                      <span className="text-sm text-gray-500">{lead.category}</span>
                      {lead.phone && <span className="text-sm text-gray-500 flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>}
                      {lead.website && <span className="text-sm text-blue-600 flex items-center gap-1"><Globe className="h-3 w-3" /> Website</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>Score: <strong className="text-gray-700">{lead.opportunityScore}/100</strong></span>
                      <span>{lead._count.messages} messages</span>
                      <span>{lead._count.notes} notes</span>
                      <span>{lead._count.followUps} follow-ups</span>
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/crm/${lead.id}`}><Eye className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteLead(lead.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
