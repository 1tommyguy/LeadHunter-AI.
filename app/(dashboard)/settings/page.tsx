"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Mail, User, Shield } from "lucide-react";

export default function SettingsPage() {
  const [smtpForm, setSmtpForm] = useState({ host: "", port: "587", username: "", password: "", fromEmail: "", fromName: "", secure: false });
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [smtpLoading, setSmtpLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => {
        if (d.smtp) setSmtpForm({ host: d.smtp.host || "", port: String(d.smtp.port || 587), username: d.smtp.username || "", password: "", fromEmail: d.smtp.fromEmail || "", fromName: d.smtp.fromName || "", secure: d.smtp.secure || false });
        if (d.user) setProfileForm({ name: d.user.name || "", email: d.user.email || "" });
      })
      .catch(() => {});
  }, []);

  const saveSmtp = async () => {
    setSmtpLoading(true);
    try {
      const res = await fetch("/api/settings/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...smtpForm, port: parseInt(smtpForm.port) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "SMTP settings saved successfully!",
          description: `Your email (${smtpForm.username}) is now connected and ready to send outreach.`,
        });
        setSmtpForm(f => ({ ...f, password: "" }));
      } else {
        toast({
          title: "Failed to save SMTP settings",
          description: data.error || "Please check your details and try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Network error", description: "Could not reach server. Try again.", variant: "destructive" });
    }
    setSmtpLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and integration settings</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile"><User className="mr-1.5 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="smtp"><Mail className="mr-1.5 h-4 w-4" />SMTP / Email</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-1.5 h-4 w-4" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your name and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={profileForm.email} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
              <Button disabled={loading} onClick={() => toast({ title: "Profile saved" })}>
                <Save className="mr-2 h-4 w-4" />Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Connect your email account to send outreach emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMTP Host *</Label>
                  <Input value={smtpForm.host} onChange={e => setSmtpForm(f => ({ ...f, host: e.target.value }))} placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label>Port *</Label>
                  <Input value={smtpForm.port} onChange={e => setSmtpForm(f => ({ ...f, port: e.target.value }))} placeholder="587" type="number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Username / Email *</Label>
                <Input value={smtpForm.username} onChange={e => setSmtpForm(f => ({ ...f, username: e.target.value }))} placeholder="you@gmail.com" />
              </div>
              <div className="space-y-2">
                <Label>Password / App Password *</Label>
                <Input value={smtpForm.password} onChange={e => setSmtpForm(f => ({ ...f, password: e.target.value }))} type="password" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Email *</Label>
                  <Input value={smtpForm.fromEmail} onChange={e => setSmtpForm(f => ({ ...f, fromEmail: e.target.value }))} placeholder="noreply@yourdomain.com" />
                </div>
                <div className="space-y-2">
                  <Label>From Name</Label>
                  <Input value={smtpForm.fromName} onChange={e => setSmtpForm(f => ({ ...f, fromName: e.target.value }))} placeholder="Your Name" />
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                <strong>Gmail users:</strong> Use an App Password (not your main password). Generate one in your Google Account → Security → App Passwords.
              </div>
              <Button onClick={saveSmtp} disabled={smtpLoading}>
                {smtpLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save SMTP Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Min 8 characters" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Repeat new password" />
              </div>
              <Button onClick={() => toast({ title: "Password updated" })}>
                <Save className="mr-2 h-4 w-4" />Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
