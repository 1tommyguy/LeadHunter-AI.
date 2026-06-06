import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const PLAN_LIMITS: Record<string, number> = {
  [process.env.STRIPE_STARTER_PRICE_ID || ""]: 100,
  [process.env.STRIPE_PRO_PRICE_ID || ""]: 1000,
  [process.env.STRIPE_AGENCY_PRICE_ID || ""]: -1,
};

const PLAN_NAMES: Record<string, string> = {
  [process.env.STRIPE_STARTER_PRICE_ID || ""]: "STARTER",
  [process.env.STRIPE_PRO_PRICE_ID || ""]: "PRO",
  [process.env.STRIPE_AGENCY_PRICE_ID || ""]: "AGENCY",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId || !subscriptionId) break;

        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = stripeSubscription.items.data[0]?.price.id;

        await prisma.subscription.update({
          where: { userId },
          data: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            plan: (PLAN_NAMES[priceId] || "STARTER") as any,
            status: "ACTIVE",
            leadsLimit: PLAN_LIMITS[priceId] || 100,
            leadsUsed: 0,
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const dbSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (!dbSub) break;

        const priceId = subscription.items.data[0]?.price.id;
        await prisma.subscription.update({
          where: { id: dbSub.id },
          data: {
            plan: (PLAN_NAMES[priceId] || dbSub.plan) as any,
            status: subscription.status === "active" ? "ACTIVE" : "INACTIVE",
            leadsLimit: PLAN_LIMITS[priceId] || dbSub.leadsLimit,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "CANCELLED", plan: "FREE", leadsLimit: 10 },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
