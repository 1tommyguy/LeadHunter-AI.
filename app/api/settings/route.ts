import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user, smtp, settings] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true, image: true } }),
    prisma.smtpConfig.findUnique({ where: { userId: session.user.id }, select: { host: true, port: true, username: true, fromEmail: true, fromName: true, secure: true } }),
    prisma.settings.findUnique({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({ user, smtp, settings });
}
