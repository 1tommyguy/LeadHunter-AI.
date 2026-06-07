"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  InboxIcon, Edit, Send, Trash2, Eye, CheckCircle,
  Archive, Loader2, Mail, MessageSquare,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  subject: string | null;
  content: string;
  status: string;
  type: string;
  createdAt: string;
  sentAt: string | null;
  lead: { businessName: string; city: string; category: string };
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  QUEUED: "bg-blue-100 text-blue-700",
  SENT: "bg-green-100 text-green-700",
  OPENED: "bg-purple-100 text-purple-700",
  REPLIED: "bg-indigo-100 text-indigo-700",
  BOUNCED: "bg-red-100 text-red-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default function OutreachQueuePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingMsg, setEditingMsg] = useState<Message | null>(null);
  const [previewMsg, setPreviewMsg] = useState<Message | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [userName, setUserName] = useState<string>("[Your Name]");
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { if (d.user?.name) setUserName(d.user.name); })
      .catch(() => {});
  }, []);

  const applyName = (content: string) => content.replace(/\[Your Name\]/g, userName);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50", ...(statusFilter !== "all" && { status: statusFilter }) });
      const res = await fetch(`/api/messages?${params}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setTotal(data.total || 0);
    } catch {
      toast({ title: "Error loading messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const updateMessage = async (id: string, updates: Record<string, unknown>) => {
    const res = await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    return res.ok;
  };

  const handleSend = async (id: string) => {
    setActionLoading(true);
    const res = await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "SENT" }),
    });
    const data = await res.json();
    if (res.ok) {
      toast({ title: "Email sent!", description: "The message has been delivered from your email account." });
      fetchMessages();
    } else {
      toast({ title: "Could not send", description: data.error || "Unknown error", variant: "destructive" });
    }
    setActionLoading(false);
  };

  const handleArchive = async (id: string) => {
    const ok = await updateMessage(id, { status: "ARCHIVED" });
    if (ok) { toast({ title: "Message archived" }); fetchMessages(); }
  };

  const handleSaveEdit = async () => {
    if (!editingMsg) return;
    setActionLoading(true);
    const ok = await updateMessage(editingMsg.id, { content: editContent, subject: editSubject });
    if (ok) { toast({ title: "Message updated" }); setEditingMsg(null); fetchMessages(); }
    else toast({ title: "Failed to update", variant: "destructive" });
    setActionLoading(false);
  };

  const handleBulkAction = async (action: "SENT" | "ARCHIVED") => {
    if (selected.size === 0) { toast({ title: "Select messages first" }); return; }
    setActionLoading(true);
    let successCount = 0;
    let failCount = 0;
    for (const id of selected) {
      const res = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: action }),
      });
      if (res.ok) successCount++;
      else failCount++;
    }
    if (action === "SENT") {
      toast({ title: `${successCount} email${successCount !== 1 ? "s" : ""} sent${failCount > 0 ? `, ${failCount} failed (check SMTP settings)` : ""}` });
    } else {
      toast({ title: `${successCount} messages archived` });
    }
    setSelected(new Set());
    fetchMessages();
    setActionLoading(false);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const stats = {
    drafts: messages.filter(m => m.status === "DRAFT").length,
    sent: messages.filter(m => m.status === "SENT").length,
    replied: messages.filter(m => m.status === "REPLIED").length,
    archived: messages.filter(m => m.status === "ARCHIVED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Outreach Queue</h1>
        <p className="text-gray-600 mt-1">Review and approve messages before sending</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Drafts", value: stats.drafts, color: "text-gray-700" },
          { label: "Sent", value: stats.sent, color: "text-green-600" },
          { label: "Replied", value: stats.replied, color: "text-indigo-600" },
          { label: "Archived", value: stats.archived, color: "text-gray-400" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & bulk actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="DRAFT">Drafts</SelectItem>
            <SelectItem value="QUEUED">Queued</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="OPENED">Opened</SelectItem>
            <SelectItem value="REPLIED">Replied</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>

        {selected.size > 0 && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleBulkAction("SENT")} disabled={actionLoading}>
              <Send className="mr-1 h-3 w-3" /> Send Selected ({selected.size})
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("ARCHIVED")} disabled={actionLoading}>
              <Archive className="mr-1 h-3 w-3" /> Archive Selected
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <InboxIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm">Find leads and outreach drafts will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 ${selected.has(msg.id) ? "bg-blue-50 border-blue-200" : ""}`}>
                  <input
                    type="checkbox"
                    checked={selected.has(msg.id)}
                    onChange={() => toggleSelect(msg.id)}
                    className="mt-1 rounded"
                    disabled={msg.status === "SENT" || msg.status === "ARCHIVED"}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-gray-900">{msg.lead.businessName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[msg.status]}`}>
                        {msg.status}
                      </span>
                      <span className="text-xs text-gray-400">{msg.lead.category} · {msg.lead.city}</span>
                    </div>
                    {msg.subject && <p className="text-sm font-medium text-gray-700 mb-1">Re: {msg.subject}</p>}
                    <p className="text-sm text-gray-600 line-clamp-2">{applyName(msg.content)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created {formatDate(msg.createdAt)}
                      {msg.sentAt && ` · Sent ${formatDate(msg.sentAt)}`}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => setPreviewMsg(msg)} title="Preview">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {msg.status === "DRAFT" && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => { setEditingMsg(msg); setEditContent(applyName(msg.content)); setEditSubject(msg.subject || ""); }} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleSend(msg.id)} title="Send" className="text-green-600">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleArchive(msg.id)} title="Archive" className="text-gray-400">
                          <Archive className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewMsg} onOpenChange={() => setPreviewMsg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Preview — {previewMsg?.lead.businessName}</DialogTitle>
          </DialogHeader>
          {previewMsg && (
            <div className="space-y-3">
              {previewMsg.subject && <div><strong>Subject:</strong> {previewMsg.subject}</div>}
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">{applyName(previewMsg.content)}</div>
            </div>
          )}
          <DialogFooter>
            {previewMsg?.status === "DRAFT" && (
              <Button onClick={() => { const id = previewMsg.id; setPreviewMsg(null); handleSend(id); }}>
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingMsg} onOpenChange={() => setEditingMsg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Message — {editingMsg?.lead.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={editSubject} onChange={e => setEditSubject(e.target.value)} placeholder="Email subject" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={12} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMsg(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
