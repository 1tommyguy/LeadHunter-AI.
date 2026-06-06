import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== "leadhunter-setup-2024") {
    return NextResponse.json({ error: "Pass ?token=leadhunter-setup-2024" }, { status: 401 });
  }

  try {
    // Verify DB is reachable and tables exist (created during build via prisma db push)
    const userCount = await prisma.user.count();
    return NextResponse.json({
      success: true,
      message: "Database is ready. Tables were created during Vercel build.",
      userCount,
      next: "Visit /api/seed?token=leadhunter-setup-2024 to load demo data",
    });
  } catch (error) {
    return NextResponse.json({
      error: "Database not ready",
      details: String(error),
      hint: "Tables are created during Vercel build (prisma db push). Check that DATABASE_URL is set in Vercel environment variables.",
    }, { status: 500 });
  }
}
