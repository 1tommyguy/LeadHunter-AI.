import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Mail,
  MessageSquare,
  Bell,
  TrendingUp,
  ArrowRight,
  Search,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [
    totalLeads,
    contactedLeads,
    repliedLeads,
    followUpsDue,
    recentLeads,
    subscription,
  ] = await Promise.all([
    prisma.lead.count({ where: { userId } }),
    prisma.lead.count({ where: { userId, status: { in: ["CONTACTED", "REPLIED", "QUALIFIED"] } } }),
    prisma.lead.count({ where: { userId, status: "REPLIED" } }),
    prisma.followUp.count({
      where: {
        userId,
        completed: false,
        dueAt: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.subscription.findUnique({ where: { userId } }),
  ]);

  const conversionRate =
    totalLeads > 0 ? Math.round((repliedLeads / totalLeads) * 100) : 0;

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Leads Contacted",
      value: contactedLeads,
      icon: Mail,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Responses",
      value: repliedLeads,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Follow-Ups Due",
      value: followUpsDue,
      icon: Bell,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
  ];

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    CONTACTED: "bg-yellow-100 text-yellow-700",
    REPLIED: "bg-green-100 text-green-700",
    QUALIFIED: "bg-purple-100 text-purple-700",
    CLOSED: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening with your leads today.
          </p>
        </div>
        <Button asChild>
          <Link href="/leads/finder">
            <Search className="mr-2 h-4 w-4" />
            Find Leads
          </Link>
        </Button>
      </div>

      {/* Subscription usage */}
      {subscription && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {subscription.plan} Plan — {subscription.leadsUsed} /{" "}
                  {subscription.leadsLimit === -1
                    ? "Unlimited"
                    : subscription.leadsLimit}{" "}
                  leads used this month
                </p>
                {subscription.plan === "FREE" && (
                  <p className="text-xs text-blue-700 mt-1">
                    Upgrade to find more leads
                  </p>
                )}
              </div>
              {subscription.plan === "FREE" && (
                <Button size="sm" asChild>
                  <Link href="/subscription">Upgrade</Link>
                </Button>
              )}
            </div>
            {subscription.leadsLimit !== -1 && (
              <div className="mt-3 h-2 bg-blue-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (subscription.leadsUsed / subscription.leadsLimit) * 100
                    )}%`,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Leads</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/leads">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No leads yet</p>
              <p className="text-sm">
                Start by finding leads in your target cities
              </p>
              <Button className="mt-4" asChild>
                <Link href="/leads/finder">
                  <Search className="mr-2 h-4 w-4" />
                  Find Your First Leads
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {lead.businessName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {lead.category} • {lead.city}, {lead.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[lead.status]
                      }`}
                    >
                      {lead.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(lead.createdAt)}
                    </span>
                    <div className="text-center">
                      <span className="text-xs font-medium text-gray-900">
                        {lead.opportunityScore}
                      </span>
                      <span className="text-xs text-gray-500">/100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
