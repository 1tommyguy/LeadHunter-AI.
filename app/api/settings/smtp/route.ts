import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { smtpConfigSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = smtpConfigSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const encryptedPass = await bcrypt.hash(parsed.data.password, 10);

  const config = await prisma.smtpConfig.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...parsed.data, password: encryptedPass },
    update: { ...parsed.data, password: encryptedPass },
  });

  return NextResponse.json({ success: true, id: config.id });
}
