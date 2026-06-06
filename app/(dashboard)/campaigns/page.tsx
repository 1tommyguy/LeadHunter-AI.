"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Mail, Loader2, Play, Pause, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
  _count?: { messages: number };
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", type: "EMAIL", template: "", subject: "" });
  const { toast } = useToast();

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch {
      toast({ title: "Error loading campaigns", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const createCampaign = async () => {
    if (!form.name.trim()) { toast({ title: "Campaign name required", variant: "destructive" }); return; }
    setCreating(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast({ title: "Campaign created!" });
      setShowCreate(false);
      setForm({ name: "", description: "", type: "EMAIL", template: "", subject: "" });
      fetchCampaigns();
    } else {
      const d = await res.json();
      toast({ title: d.error || "Failed to create campaign", variant: "destructive" });
    }
    setCreating(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchCampaigns();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your email outreach campaigns</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />New Campaign
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No campaigns yet</p>
            <p className="text-sm">Create your first outreach campaign to get started</p>
            <Button className="mt-4" onClick={() => setShowCreate(true)}>
              <Plus className="mr-2 h-4 w-4" />Create Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map(campaign => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    {campaign.description && <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLORS[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Type: <strong>{campaign.type}</strong></p>
                  {campaign._count && <p>Messages: <strong>{campaign._count.messages}</strong></p>}
                  <p>Created: {formatDate(campaign.createdAt)}</p>
                  {campaign.scheduledAt && <p>Scheduled: {formatDate(campaign.scheduledAt)}</p>}
                </div>
                <div className="flex gap-2 mt-4">
                  {campaign.status === "DRAFT" && (
                    <Button size="sm" onClick={() => updateStatus(campaign.id, "ACTIVE")}>
                      <Play className="mr-1 h-3 w-3" />Activate
                    </Button>
                  )}
                  {campaign.status === "ACTIVE" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(campaign.id, "PAUSED")}>
                      <Pause className="mr-1 h-3 w-3" />Pause
                    </Button>
                  )}
                  {campaign.status === "PAUSED" && (
                    <Button size="sm" onClick={() => updateStatus(campaign.id, "ACTIVE")}>
                      <Play className="mr-1 h-3 w-3" />Resume
                    </Button>
                  )}
                  {(campaign.status === "ACTIVE" || campaign.status === "PAUSED") && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(campaign.id, "COMPLETED")}>
                      <CheckCircle className="mr-1 h-3 w-3" />Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Campaign</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Lagos Restaurants Q1" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Optional description" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="CONTACT_FORM">Contact Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email Subject</Label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Subject line" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={createCampaign} disabled={creating}>
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
