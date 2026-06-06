import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for freelancers getting started",
    leads: "100 leads/month",
    features: [
      "100 leads per month",
      "Website audit engine",
      "Lead scoring",
      "Outreach generator",
      "Basic CRM",
      "Follow-up reminders",
      "Email support",
    ],
    highlighted: false,
    cta: "Start Free Trial",
  },
  {
    name: "Pro",
    price: 79,
    description: "For growing agencies and developers",
    leads: "1,000 leads/month",
    features: [
      "1,000 leads per month",
      "Everything in Starter",
      "Email campaigns",
      "Advanced analytics",
      "SMTP integration",
      "Priority support",
      "API access",
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    name: "Agency",
    price: 199,
    description: "For large agencies with unlimited needs",
    leads: "Unlimited leads",
    features: [
      "Unlimited leads",
      "Everything in Pro",
      "Multiple team members",
      "White-label reports",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-blue-600 text-white ring-4 ring-blue-300 scale-105"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-2 ${
                  plan.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-6 ${
                  plan.highlighted ? "text-blue-100" : "text-gray-600"
                }`}
              >
                {plan.description}
              </p>

              <div className="mb-6">
                <span
                  className={`text-4xl font-extrabold ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.highlighted ? "text-blue-100" : "text-gray-600"
                  }`}
                >
                  /month
                </span>
              </div>

              <div
                className={`text-sm font-medium mb-6 px-3 py-1.5 rounded-full inline-block ${
                  plan.highlighted
                    ? "bg-blue-500 text-white"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {plan.leads}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check
                      className={`h-4 w-4 flex-shrink-0 ${
                        plan.highlighted ? "text-blue-100" : "text-green-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlighted ? "text-blue-50" : "text-gray-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : ""
                }`}
                variant={plan.highlighted ? "outline" : "default"}
                asChild
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
