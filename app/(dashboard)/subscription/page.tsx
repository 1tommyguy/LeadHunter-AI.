"use client";

import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Zap, Mail } from "lucide-react";
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
  },
  {
    name: "Pro",
    key: "PRO",
    price: 79,
    leads: "1,000 leads/month",
    highlighted: true,
    features: ["1,000 leads per month", "Everything in Starter", "Email campaigns", "Advanced analytics", "SMTP integration", "Priority support"],
  },
  {
    name: "Agency",
    key: "AGENCY",
    price: 199,
    leads: "Unlimited leads",
    features: ["Unlimited leads", "Everything in Pro", "Multiple team members", "White-label reports", "Custom integrations", "Dedicated support"],
  },
];

function SubscriptionPageInner() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    if (success) toast({ title: "Plan activated!", description: "Your plan has been updated." });
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
      if (data.success) {
        toast({ title: `Upgraded to ${planKey}!`, description: "Your plan has been updated." });
        // Refresh subscription data
        const subRes = await fetch("/api/subscription");
        setSubscription(await subRes.json());
      } else {
        toast({ title: data.error || "Upgrade failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setUpgrading(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your plan</p>
      </div>

      {/* Demo notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <Mail className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-900">Payments coming soon</p>
          <p className="text-sm text-amber-700">Stripe integration is in progress. For now, you can switch plans directly for demo purposes. Contact us to activate a paid plan.</p>
        </div>
      </div>

      {/* Current plan */}
      {subscription && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-lg font-semibold text-blue-900">
                  Current Plan: <span className="text-blue-700">{subscription.plan}</span>
                </p>
                <p className="text-blue-700 mt-0.5">
                  {subscription.leadsUsed} / {subscription.leadsLimit === -1 ? "Unlimited" : subscription.leadsLimit} leads used this month
                </p>
              </div>
            </div>
            {subscription.leadsLimit !== -1 && (
              <div className="mt-4 h-2 bg-blue-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (subscription.leadsUsed / subscription.leadsLimit) * 100)}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map(plan => {
          const isCurrent = subscription?.plan === plan.key;
          return (
            <Card key={plan.key} className={`relative border-2 ${plan.highlighted ? "border-blue-500 shadow-lg" : "border-gray-200"}`}>
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
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button className="w-full" disabled variant="outline">✓ Current Plan</Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.key)}
                    disabled={!!upgrading}
                  >
                    {upgrading === plan.key ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Switch to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
      <SubscriptionPageInner />
    </Suspense>
  );
}
