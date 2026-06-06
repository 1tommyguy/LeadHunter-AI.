import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== "leadhunter-setup-2024") {
    return NextResponse.json({ error: "Pass ?token=leadhunter-setup-2024" }, { status: 401 });
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

  return NextResponse.json({ success: true, steps: results, next: "Now visit /api/seed?token=leadhunter-setup-2024 to load demo data" });
}
