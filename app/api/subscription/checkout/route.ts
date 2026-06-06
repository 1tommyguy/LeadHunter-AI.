import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { plan } = body as { plan: string };

  if (!["STARTER", "PRO", "AGENCY"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const planLimits: Record<string, { limit: number; name: string }> = {
    STARTER: { limit: 100, name: "STARTER" },
    PRO: { limit: 1000, name: "PRO" },
    AGENCY: { limit: -1, name: "AGENCY" },
  };

  const selected = planLimits[plan];

  await prisma.subscription.update({
    where: { userId: session.user.id },
    data: {
      plan: selected.name as any,
      status: "ACTIVE",
      leadsLimit: selected.limit,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return NextResponse.json({ success: true, redirectUrl: "/subscription?success=true" });
}
