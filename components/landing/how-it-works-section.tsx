import { Search, Star, MessageSquare, Send, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find Businesses in Any City",
    description:
      "Go to Lead Finder. Type a city name and choose a business type — restaurants, dental clinics, hotels, salons, schools, and more. LeadHunter AI instantly discovers local businesses and checks each one for a website.",
    color: "bg-blue-600",
    lightColor: "bg-blue-50 text-blue-600",
    tip: "Try searching Lagos + Restaurant to find your first leads.",
  },
  {
    number: "02",
    icon: Star,
    title: "Review Your Lead Scores",
    description:
      "Every discovered business gets an automatic opportunity score from 0 to 100. Businesses with no website score highest. Those with outdated or non-mobile sites score next. The higher the score, the better your chance of winning their business.",
    color: "bg-purple-600",
    lightColor: "bg-purple-50 text-purple-600",
    tip: "Sort by score and focus on leads above 70 first.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Generate Personalized Outreach",
    description:
      "Click any lead and go to its detail page. Choose a service type — Website Design, SEO, Digital Marketing, or Business Automation — and LeadHunter AI generates a personalized message you can edit before sending.",
    color: "bg-green-600",
    lightColor: "bg-green-50 text-green-600",
    tip: "Always personalize the message with the business owner's name if you know it.",
  },
  {
    number: "04",
    icon: Send,
    title: "Approve and Send",
    description:
      "Messages are saved as drafts first. Go to Outreach Queue, review each message, make any edits, then approve and send. You stay in control — nothing goes out without your approval.",
    color: "bg-orange-600",
    lightColor: "bg-orange-50 text-orange-600",
    tip: "Connect your SMTP in Settings to send directly from your own email address.",
  },
  {
    number: "05",
    icon: BarChart3,
    title: "Manage Your Pipeline",
    description:
      "Every lead moves through your CRM pipeline: New → Contacted → Replied → Qualified → Closed. Add notes, schedule follow-ups, and track conversations. The Analytics page shows your progress across all leads over time.",
    color: "bg-pink-600",
    lightColor: "bg-pink-50 text-pink-600",
    tip: "Set a 3-day follow-up reminder on every lead you contact.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            From Zero to Signed Client in 5 Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            LeadHunter AI handles the hard part — finding businesses, scoring
            them, and writing the outreach. You just approve and send.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-10 lg:gap-16`}
            >
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl font-black text-gray-100 leading-none select-none">
                    {step.number}
                  </span>
                  <div className={`p-2 rounded-lg ${step.lightColor}`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {step.description}
                </p>
                <div className="flex items-start gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <span className="text-blue-600 font-bold text-sm mt-0.5 flex-shrink-0">
                    💡 Tip:
                  </span>
                  <p className="text-sm text-gray-600">{step.tip}</p>
                </div>
              </div>

              {/* Visual card */}
              <div className="flex-1 w-full">
                <div
                  className={`${step.color} rounded-2xl p-8 text-white min-h-48 flex flex-col justify-between shadow-lg`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-semibold text-white text-lg">
                      Step {step.number}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-opacity-90 text-sm font-medium uppercase tracking-wide mb-2">
                      Action
                    </p>
                    <p className="text-white text-xl font-bold leading-snug">
                      {step.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-gray-600 text-lg">
              Ready to find your first client?
            </p>
            <a
              href="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg shadow-md"
            >
              Start for Free
              <ArrowRight className="h-5 w-5" />
            </a>
            <p className="text-sm text-gray-500">No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
}
