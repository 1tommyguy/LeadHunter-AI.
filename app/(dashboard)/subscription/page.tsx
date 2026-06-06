"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

interface SubscriptionData {
  plan: string;
  status: string;
  leadsUsed: number;
  leadsLimit: number;
  currentPeriodEnd: string | null;
}

const PLANS = [
  {
    name: "Starter",
    key: "STARTER",
    price: 29,
    leads: "100 leads/month",
    features: ["100 leads per month", "Website audit engine", "Lead scoring", "Outreach generator", "Basic CRM", "Follow-up reminders", "Email support"],
    color: "border-gray-200",
  },
  {
    name: "Pro",
    key: "PRO",
    price: 79,
    leads: "1,000 leads/month",
    features: ["1,000 leads per month", "Everything in Starter", "Email campaigns", "Advanced analytics", "SMTP integration", "Priority support", "API access"],
    color: "border-blue-500",
    highlighted: true,
  },
  {
    name: "Agency",
    key: "AGENCY",
    price: 199,
    leads: "Unlimited leads",
    features: ["Unlimited leads", "Everything in Pro", "Multiple team members", "White-label reports", "Custom integrations", "Dedicated support"],
    color: "border-gray-200",
  },
];

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success) toast({ title: "Subscription activated!", description: "Welcome to your new plan." });
    if (canceled) toast({ title: "Checkout canceled", description: "Your subscription was not changed." });
  }, [searchParams, toast]);

  useEffect(() => {
    fetch("/api/subscription")
      .then(r => r.json())
      .then(d => { setSubscription(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planKey: string) => {
    setUpgrading(planKey);
    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast({ title: data.error || "Failed to create checkout session", variant: "destructive" });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setUpgrading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await fetch("/api/subscription/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast({ title: "Failed to open billing portal", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your plan and billing</p>
      </div>

      {/* Current plan */}
      {subscription && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-blue-900">Current Plan: {subscription.plan}</h3>
                  <Badge variant="info">{subscription.status}</Badge>
                </div>
                <p className="text-blue-700">
                  {subscription.leadsUsed} / {subscription.leadsLimit === -1 ? "Unlimited" : subscription.leadsLimit} leads used this month
                </p>
                {subscription.currentPeriodEnd && (
                  <p className="text-sm text-blue-600 mt-1">
                    Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
              {subscription.plan !== "FREE" && (
                <Button variant="outline" onClick={handleManageBilling}>
                  <CreditCard className="mr-2 h-4 w-4" />Manage Billing
                </Button>
              )}
            </div>
            {subscription.leadsLimit !== -1 && (
              <div className="mt-4 h-2 bg-blue-200 rounded-full">
                <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${Math.min(100, (subscription.leadsUsed / subscription.leadsLimit) * 100)}%` }} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => {
            const isCurrent = subscription?.plan === plan.key;
            return (
              <Card key={plan.key} className={`relative border-2 ${plan.highlighted ? "border-blue-500 shadow-lg" : plan.color}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <Zap className="h-3 w-3" />Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 pb-1">/month</span>
                  </div>
                  <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full inline-block">{plan.leads}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <Button className="w-full" disabled variant="outline">Current Plan</Button>
                  ) : (
                    <Button
                      className={`w-full ${plan.highlighted ? "" : ""}`}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan.key)}
                      disabled={!!upgrading}
                    >
                      {upgrading === plan.key ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {subscription?.plan === "FREE" ? "Start Trial" : "Upgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
