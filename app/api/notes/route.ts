import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { noteSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = noteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const lead = await prisma.lead.findFirst({
    where: { id: parsed.data.leadId, userId: session.user.id },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      leadId: parsed.data.leadId,
      content: parsed.data.content,
    },
  });

  return NextResponse.json(note, { status: 201 });
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

  const note = await prisma.note.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await prisma.note.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
