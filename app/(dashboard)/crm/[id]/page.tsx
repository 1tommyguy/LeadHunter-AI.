"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Globe, Phone, Mail, MapPin, Star, StickyNote,
  MessageSquare, Bell, Plus, Trash2, Send, Loader2,
} from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateTime } from "@/lib/utils";
import { generateOutreachMessage } from "@/lib/lead-scorer";

interface Lead {
  id: string;
  businessName: string;
  category: string;
  city: string;
  country: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  contactFormUrl: string | null;
  rating: number | null;
  status: string;
  opportunity: string;
  opportunityScore: number;
  hasWebsite: boolean;
  websiteOutdated: boolean;
  mobileScore: number | null;
  seoScore: number | null;
  createdAt: string;
  notes: { id: string; content: string; createdAt: string }[];
  messages: { id: string; subject: string | null; content: string; status: string; createdAt: string; sentAt: string | null }[];
  followUps: { id: string; dueAt: string; notes: string | null; type: string; completed: boolean }[];
}

const STATUS_OPTIONS = ["NEW", "CONTACTED", "REPLIED", "QUALIFIED", "CLOSED"];

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [msgTemplate, setMsgTemplate] = useState("Website Design");
  const [msgContent, setMsgContent] = useState("");
  const [msgSubject, setMsgSubject] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchLead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) { router.push("/crm"); return; }
      const data = await res.json();
      setLead(data);
      // Pre-fill message
      const content = generateOutreachMessage("Website Design", {
        businessName: data.businessName,
        category: data.category,
        city: data.city,
        hasWebsite: data.hasWebsite,
        websiteOutdated: data.websiteOutdated,
        mobileScore: data.mobileScore || 0,
        seoScore: data.seoScore || 0,
      });
      setMsgContent(content);
      setMsgSubject(`Website Services for ${data.businessName}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [id]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLead(prev => prev ? { ...prev, status } : null);
    toast({ title: "Status updated" });
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    setSaving(true);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: id, content: noteText }),
    });
    if (res.ok) {
      toast({ title: "Note added" });
      setNoteText("");
      fetchLead();
    }
    setSaving(false);
  };

  const deleteNote = async (noteId: string) => {
    await fetch(`/api/notes?id=${noteId}`, { method: "DELETE" });
    fetchLead();
  };

  const addFollowUp = async () => {
    if (!followUpDate) { toast({ title: "Select a date", variant: "destructive" }); return; }
    setSaving(true);
    const res = await fetch("/api/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: id, dueAt: followUpDate, notes: followUpNotes, type: "EMAIL" }),
    });
    if (res.ok) {
      toast({ title: "Follow-up scheduled" });
      setFollowUpDate("");
      setFollowUpNotes("");
      fetchLead();
    }
    setSaving(false);
  };

  const generateMsg = () => {
    if (!lead) return;
    const content = generateOutreachMessage(msgTemplate, {
      businessName: lead.businessName,
      category: lead.category,
      city: lead.city,
      hasWebsite: lead.hasWebsite,
      websiteOutdated: lead.websiteOutdated,
      mobileScore: lead.mobileScore || 0,
      seoScore: lead.seoScore || 0,
    });
    setMsgContent(content);
  };

  const saveMessage = async (status: "DRAFT" | "SENT") => {
    setSaving(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: id, subject: msgSubject, content: msgContent, type: "EMAIL", status }),
    });
    if (res.ok) {
      toast({ title: status === "SENT" ? "Message sent!" : "Draft saved" });
      fetchLead();
    }
    setSaving(false);
  };

  const completeFollowUp = async (fuId: string) => {
    await fetch("/api/followups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: fuId, completed: true }),
    });
    fetchLead();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  if (!lead) return null;

  const oppColor = lead.opportunity === "HIGH" ? "text-green-600 bg-green-50" : lead.opportunity === "MEDIUM" ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/crm"><ArrowLeft className="h-4 w-4 mr-1" />Back to CRM</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead info */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{lead.businessName}</CardTitle>
                  <p className="text-sm text-gray-500 mt-0.5">{lead.category}</p>
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-lg ${oppColor}`}>
                  {lead.opportunityScore}/100
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.address && <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="h-4 w-4 flex-shrink-0" />{lead.address}</div>}
              {lead.phone && <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="h-4 w-4 flex-shrink-0" />{lead.phone}</div>}
              {lead.email && <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="h-4 w-4 flex-shrink-0" />{lead.email}</div>}
              {lead.website && <div className="flex items-center gap-2 text-sm text-blue-600"><Globe className="h-4 w-4 flex-shrink-0" /><a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{lead.website}</a></div>}
              {lead.rating && <div className="flex items-center gap-2 text-sm text-gray-600"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />{lead.rating} rating</div>}

              <div className="border-t pt-3 space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="font-medium">{lead.hasWebsite ? "Yes" : "No"}</div>
                    <div className="text-gray-500">Website</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="font-medium">{lead.mobileScore ?? "N/A"}</div>
                    <div className="text-gray-500">Mobile</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="font-medium">{lead.seoScore ?? "N/A"}</div>
                    <div className="text-gray-500">SEO</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</Label>
                <Select value={lead.status} onValueChange={updateStatus}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-gray-400">Found {formatDate(lead.createdAt)}</p>
            </CardContent>
          </Card>

          {/* Quick follow-up dates */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Quick Follow-Up</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[3, 7, 14].map(days => {
                const d = new Date();
                d.setDate(d.getDate() + days);
                const dateStr = d.toISOString().split("T")[0];
                return (
                  <Button key={days} variant="outline" size="sm" className="w-full text-xs" onClick={async () => {
                    await fetch("/api/followups", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ leadId: id, dueAt: dateStr, type: "EMAIL" }),
                    });
                    toast({ title: `Follow-up set for ${days} days` });
                    fetchLead();
                  }}>
                    <Bell className="mr-1.5 h-3 w-3" />Follow up in {days} days
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Outreach, Notes, Follow-ups, History */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="outreach">
            <TabsList className="w-full">
              <TabsTrigger value="outreach" className="flex-1">Outreach</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes ({lead.notes.length})</TabsTrigger>
              <TabsTrigger value="followups" className="flex-1">Follow-Ups ({lead.followUps.filter(f => !f.completed).length})</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">History ({lead.messages.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="outreach" className="mt-4">
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex gap-3">
                    <Select value={msgTemplate} onValueChange={v => { setMsgTemplate(v); }}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Template" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Website Design", "SEO Services", "Digital Marketing", "Business Automation"].map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={generateMsg}>Regenerate</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input value={msgSubject} onChange={e => setMsgSubject(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea value={msgContent} onChange={e => setMsgContent(e.target.value)} rows={14} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => saveMessage("DRAFT")} disabled={saving}>Save Draft</Button>
                    <Button onClick={() => saveMessage("SENT")} disabled={saving}>
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-4">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note..." rows={3} />
                  <Button onClick={addNote} disabled={saving || !noteText.trim()} size="sm">
                    <Plus className="mr-1.5 h-4 w-4" />Add Note
                  </Button>
                </CardContent>
              </Card>
              {lead.notes.map(note => (
                <Card key={note.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-gray-700 flex-1 whitespace-pre-wrap">{note.content}</p>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 flex-shrink-0" onClick={() => deleteNote(note.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{formatDateTime(note.createdAt)}</p>
                  </CardContent>
                </Card>
              ))}
              {lead.notes.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No notes yet</div>}
            </TabsContent>

            <TabsContent value="followups" className="mt-4 space-y-4">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Due Date</Label>
                      <Input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>Notes (optional)</Label>
                      <Input value={followUpNotes} onChange={e => setFollowUpNotes(e.target.value)} placeholder="Quick note" />
                    </div>
                  </div>
                  <Button onClick={addFollowUp} disabled={saving} size="sm">
                    <Bell className="mr-1.5 h-4 w-4" />Schedule Follow-Up
                  </Button>
                </CardContent>
              </Card>
              {lead.followUps.map(fu => (
                <Card key={fu.id} className={fu.completed ? "opacity-60" : ""}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Due: {formatDate(fu.dueAt)}</p>
                        {fu.notes && <p className="text-sm text-gray-600 mt-0.5">{fu.notes}</p>}
                        <p className="text-xs text-gray-400 mt-1">{fu.type} follow-up</p>
                      </div>
                      {!fu.completed && (
                        <Button variant="outline" size="sm" onClick={() => completeFollowUp(fu.id)}>
                          Mark Done
                        </Button>
                      )}
                      {fu.completed && <span className="text-xs text-green-600 font-medium">✓ Done</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {lead.followUps.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No follow-ups scheduled</div>}
            </TabsContent>

            <TabsContent value="history" className="mt-4 space-y-3">
              {lead.messages.map(msg => (
                <Card key={msg.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        {msg.subject && <p className="font-medium text-sm">{msg.subject}</p>}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          msg.status === "SENT" ? "bg-green-100 text-green-700" :
                          msg.status === "DRAFT" ? "bg-gray-100 text-gray-700" :
                          msg.status === "REPLIED" ? "bg-indigo-100 text-indigo-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>{msg.status}</span>
                      </div>
                      <p className="text-xs text-gray-400">{formatDate(msg.createdAt)}</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">{msg.content}</p>
                    {msg.sentAt && <p className="text-xs text-gray-400 mt-1">Sent: {formatDateTime(msg.sentAt)}</p>}
                  </CardContent>
                </Card>
              ))}
              {lead.messages.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No messages yet</div>}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
