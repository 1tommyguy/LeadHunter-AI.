import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { followUpSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const completed = searchParams.get("completed");
  const upcoming = searchParams.get("upcoming");

  const where = {
    userId: session.user.id,
    ...(completed !== null && { completed: completed === "true" }),
    ...(upcoming === "true" && {
      completed: false,
      dueAt: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    }),
  };

  const followUps = await prisma.followUp.findMany({
    where,
    include: {
      lead: { select: { businessName: true, city: true, category: true, status: true } },
    },
    orderBy: { dueAt: "asc" },
  });

  return NextResponse.json(followUps);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = followUpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const followUp = await prisma.followUp.create({
    data: {
      userId: session.user.id,
      leadId: parsed.data.leadId,
      dueAt: new Date(parsed.data.dueAt),
      notes: parsed.data.notes,
      type: parsed.data.type,
    },
  });

  return NextResponse.json(followUp, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, completed } = body;

  const followUp = await prisma.followUp.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!followUp) {
    return NextResponse.json({ error: "Follow-up not found" }, { status: 404 });
  }

  const updated = await prisma.followUp.update({
    where: { id },
    data: {
      completed,
      ...(completed && { completedAt: new Date() }),
    },
  });

  return NextResponse.json(updated);
}
