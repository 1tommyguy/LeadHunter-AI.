import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const leadId = searchParams.get("leadId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where = {
    userId: session.user.id,
    ...(status && { status: status as any }),
    ...(leadId && { leadId }),
  };

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      include: { lead: { select: { businessName: true, city: true, category: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.message.count({ where }),
  ]);

  return NextResponse.json({ messages, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      userId: session.user.id,
      ...parsed.data,
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : undefined,
    },
  });

  return NextResponse.json(message, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, status, content, subject } = body;

  const message = await prisma.message.findFirst({
    where: { id, userId: session.user.id },
    include: { lead: { select: { email: true, businessName: true } } },
  });

  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  // Actually send via SMTP when status changes to SENT
  if (status === "SENT") {
    const smtp = await prisma.smtpConfig.findUnique({ where: { userId: session.user.id } });

    if (!smtp) {
      return NextResponse.json(
        { error: "No SMTP settings found. Go to Settings → SMTP / Email to connect your email account." },
        { status: 400 }
      );
    }

    const toEmail = message.lead.email;
    if (!toEmail) {
      return NextResponse.json(
        { error: `No email address found for ${message.lead.businessName}. You can copy the message and contact them manually.` },
        { status: 400 }
      );
    }

    try {
      const { sendEmail } = await import("@/lib/send-email");
      await sendEmail({
        smtp,
        to: toEmail,
        subject: message.subject ?? `Partnership Opportunity for ${message.lead.businessName}`,
        text: content ?? message.content,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json(
        { error: `Failed to send email: ${message}. Check your SMTP settings in Settings → SMTP / Email.` },
        { status: 500 }
      );
    }
  }

  const updated = await prisma.message.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(content && { content }),
      ...(subject && { subject }),
      ...(status === "SENT" && { sentAt: new Date() }),
    },
  });

  // Update lead status to CONTACTED after successful send
  if (status === "SENT") {
    await prisma.lead.update({
      where: { id: message.leadId },
      data: { status: "CONTACTED" },
    });
  }

  return NextResponse.json(updated);
}
