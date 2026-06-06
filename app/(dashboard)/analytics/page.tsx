"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { TrendingUp, Mail, MessageSquare, Users, Loader2 } from "lucide-react";

interface AnalyticsData {
  overview: {
    totalLeads: number;
    openRate: number;
    replyRate: number;
    conversionRate: number;
    sentMessages: number;
    qualifiedLeads: number;
  };
  leadsByStatus: { status: string; count: number }[];
  leadsByOpportunity: { opportunity: string; count: number }[];
  leadsByCity: { city: string; count: number }[];
  leadsByCategory: { category: string; count: number }[];
  leadsOverTime: { date: string; count: number }[];
}

const OPPORTUNITY_COLORS = { HIGH: "#16a34a", MEDIUM: "#d97706", LOW: "#dc2626" };
const STATUS_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#6b7280"];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) return <div className="text-center py-12 text-gray-500">Failed to load analytics.</div>;

  const overviewCards = [
    { label: "Total Leads", value: data.overview.totalLeads, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Open Rate", value: `${data.overview.openRate}%`, icon: Mail, color: "text-green-600", bg: "bg-green-50" },
    { label: "Reply Rate", value: `${data.overview.replyRate}%`, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Conversion Rate", value: `${data.overview.conversionRate}%`, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const opportunityData = data.leadsByOpportunity.map(item => ({
    name: item.opportunity,
    value: item.count,
    fill: OPPORTUNITY_COLORS[item.opportunity as keyof typeof OPPORTUNITY_COLORS] || "#gray",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your lead generation and outreach performance</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map(card => (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leads over time */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Found Over Time (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.leadsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={d => d.slice(5)} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={d => `Date: ${d}`} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} name="Leads" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Status */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.leadsByStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" name="Leads" radius={[0, 4, 4, 0]}>
                  {data.leadsByStatus.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By Opportunity */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Opportunity</CardTitle>
          </CardHeader>
          <CardContent>
            {opportunityData.length === 0 ? (
              <div className="flex items-center justify-center h-[220px] text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={opportunityData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {opportunityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* By City */}
        <Card>
          <CardHeader>
            <CardTitle>Top Cities</CardTitle>
          </CardHeader>
          <CardContent>
            {data.leadsByCity.length === 0 ? (
              <div className="flex items-center justify-center h-[220px] text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.leadsByCity.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="city" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* By Category */}
        <Card>
          <CardHeader>
            <CardTitle>Top Business Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {data.leadsByCategory.length === 0 ? (
              <div className="flex items-center justify-center h-[220px] text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.leadsByCategory.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
