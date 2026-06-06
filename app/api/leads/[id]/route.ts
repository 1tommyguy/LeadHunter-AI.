import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const lead = await prisma.lead.findFirst({
    where: { id, userId: session.user.id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "desc" } },
      followUps: { orderBy: { dueAt: "asc" } },
    },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json(lead);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const lead = await prisma.lead.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: {
      status: body.status,
      notes: body.notes,
    },
  });

  return NextResponse.json(updated);
}
