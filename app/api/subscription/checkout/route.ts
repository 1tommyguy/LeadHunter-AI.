import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, createCheckoutSession, type PlanType } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { plan } = body as { plan: PlanType };

  if (!["STARTER", "PRO", "AGENCY"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_...") {
    return NextResponse.json(
      { error: "Stripe not configured. Please set STRIPE_SECRET_KEY in your environment variables." },
      { status: 503 }
    );
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });

  try {
    const url = await createCheckoutSession(
      session.user.id,
      user!.email!,
      plan,
      subscription?.stripeCustomerId ?? undefined
    );
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
