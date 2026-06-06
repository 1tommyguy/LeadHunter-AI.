import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let dbStatus = "unknown";
  let userCount = 0;
  try {
    userCount = await prisma.user.count();
    dbStatus = "connected";
  } catch (e) {
    dbStatus = "error: " + String(e).slice(0, 100);
  }

  return NextResponse.json({
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "SET (" + process.env.DATABASE_URL.slice(0, 20) + "...)" : "MISSING",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET (length:" + process.env.NEXTAUTH_SECRET.length + ")" : "MISSING",
      AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "MISSING",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    },
    database: { status: dbStatus, userCount },
  });
}
