import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status") || undefined;
  const opportunity = searchParams.get("opportunity") || undefined;
  const search = searchParams.get("search") || undefined;

  const where = {
    userId: session.user.id,
    ...(status && { status: status as any }),
    ...(opportunity && { opportunity: opportunity as any }),
    ...(search && {
      OR: [
        { businessName: { contains: search, mode: "insensitive" as any } },
        { city: { contains: search, mode: "insensitive" as any } },
        { category: { contains: search, mode: "insensitive" as any } },
      ],
    }),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { notes: true, messages: true, followUps: true } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json({
    leads,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const lead = await prisma.lead.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  await prisma.lead.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
