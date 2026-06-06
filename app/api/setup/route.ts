import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized — pass ?secret=YOUR_NEXTAUTH_SECRET" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    const pushOutput = execSync("npx prisma db push --skip-generate --accept-data-loss", {
      env: { ...process.env },
      timeout: 50000,
      encoding: "utf8",
    });
    results.push("Schema pushed: " + pushOutput.trim());
  } catch (e: unknown) {
    return NextResponse.json({ error: "prisma db push failed", details: String(e) }, { status: 500 });
  }

  return NextResponse.json({ success: true, steps: results, next: "Now visit /api/seed?secret=YOUR_SECRET to load demo data" });
}
