import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBillingPortalSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
  }

  try {
    const url = await createBillingPortalSession(subscription.stripeCustomerId);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Billing portal error:", error);
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}
