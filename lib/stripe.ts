// Stripe integration placeholder — wire up when ready
// Install: npm install stripe @stripe/stripe-js
// Then replace this file with the full Stripe implementation

export const PLANS = {
  FREE: { name: "Free", price: 0, leadsLimit: 10 },
  STARTER: { name: "Starter", price: 29, leadsLimit: 100 },
  PRO: { name: "Pro", price: 79, leadsLimit: 1000 },
  AGENCY: { name: "Agency", price: 199, leadsLimit: -1 },
} as const;

export type PlanType = keyof typeof PLANS;
