import { NextRequest, NextResponse } from "next/server";

// Stripe webhooks disabled — payment integration not active
export async function POST(req: NextRequest) {
  return NextResponse.json({ received: true });
}
