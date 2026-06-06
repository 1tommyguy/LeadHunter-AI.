import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { campaignSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = campaignSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const campaign = await prisma.campaign.create({
    data: {
      userId: session.user.id,
      ...parsed.data,
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : undefined,
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, status } = body;

  const campaign = await prisma.campaign.findFirst({ where: { id, userId: session.user.id } });
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

  const updated = await prisma.campaign.update({
    where: { id },
    data: { ...(status && { status }) },
  });

  return NextResponse.json(updated);
}
