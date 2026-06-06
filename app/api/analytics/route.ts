import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [
    totalLeads,
    leadsByStatus,
    leadsByOpportunity,
    messageStats,
    leadsByCity,
    leadsByCategory,
    recentActivity,
  ] = await Promise.all([
    prisma.lead.count({ where: { userId } }),
    prisma.lead.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    prisma.lead.groupBy({
      by: ["opportunity"],
      where: { userId },
      _count: { opportunity: true },
    }),
    prisma.message.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    prisma.lead.groupBy({
      by: ["city"],
      where: { userId },
      _count: { city: true },
      orderBy: { _count: { city: "desc" } },
      take: 10,
    }),
    prisma.lead.groupBy({
      by: ["category"],
      where: { userId },
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
      take: 10,
    }),
    prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { createdAt: true },
    }),
  ]);

  const sentMessages = messageStats.find((m) => m.status === "SENT")?._count.status || 0;
  const openedMessages = messageStats.find((m) => m.status === "OPENED")?._count.status || 0;
  const repliedMessages = messageStats.find((m) => m.status === "REPLIED")?._count.status || 0;
  const qualifiedLeads = leadsByStatus.find((l) => l.status === "QUALIFIED")?._count.status || 0;

  const openRate = sentMessages > 0 ? Math.round((openedMessages / sentMessages) * 100) : 0;
  const replyRate = sentMessages > 0 ? Math.round((repliedMessages / sentMessages) * 100) : 0;
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  // Build daily lead chart data (last 30 days)
  const dailyData: Record<string, number> = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split("T")[0];
    dailyData[key] = 0;
  }

  recentActivity.forEach((lead) => {
    const key = lead.createdAt.toISOString().split("T")[0];
    if (key in dailyData) {
      dailyData[key]++;
    }
  });

  const leadsOverTime = Object.entries(dailyData).map(([date, count]) => ({
    date,
    count,
  }));

  return NextResponse.json({
    overview: {
      totalLeads,
      openRate,
      replyRate,
      conversionRate,
      sentMessages,
      qualifiedLeads,
    },
    leadsByStatus: leadsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    leadsByOpportunity: leadsByOpportunity.map((item) => ({
      opportunity: item.opportunity,
      count: item._count.opportunity,
    })),
    messageStats: messageStats.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    leadsByCity: leadsByCity.map((item) => ({
      city: item.city,
      count: item._count.city,
    })),
    leadsByCategory: leadsByCategory.map((item) => ({
      category: item.category,
      count: item._count.category,
    })),
    leadsOverTime,
  });
}
