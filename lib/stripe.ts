import Stripe from "stripe";

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key, { apiVersion: "2025-02-24.acacia", typescript: true });
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripeClient();
    return (client as any)[prop];
  },
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    leadsLimit: 10,
    priceId: null,
  },
  STARTER: {
    name: "Starter",
    price: 29,
    leadsLimit: 100,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
  },
  PRO: {
    name: "Pro",
    price: 79,
    leadsLimit: 1000,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  AGENCY: {
    name: "Agency",
    price: 199,
    leadsLimit: -1, // unlimited
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
  },
} as const;

export type PlanType = keyof typeof PLANS;

export async function createCheckoutSession(
  userId: string,
  email: string,
  planType: PlanType,
  customerId?: string
): Promise<string> {
  const plan = PLANS[planType];
  if (!plan.priceId) throw new Error("Invalid plan");

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : email,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session.url!;
}

export async function createBillingPortalSession(
  customerId: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription`,
  });

  return session.url;
}
