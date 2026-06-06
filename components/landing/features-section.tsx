import {
  Search,
  BarChart3,
  Mail,
  Bell,
  Users,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Lead Finder",
    description:
      "Search any city and business type. Find restaurants, dentists, hotels, and more that need web services.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Website Audit Engine",
    description:
      "Automatically check if businesses have websites, analyze mobile responsiveness, and score SEO.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Zap,
    title: "AI Lead Scoring",
    description:
      "Each lead gets an opportunity score from 0-100 based on website quality, SEO, and mobile experience.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Mail,
    title: "Outreach Generator",
    description:
      "Generate personalized outreach messages for web design, SEO, digital marketing, and automation.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Users,
    title: "Built-in CRM",
    description:
      "Track every lead with notes, contact history, follow-up dates, and deal status in one place.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Bell,
    title: "Follow-Up System",
    description:
      "Never miss a follow-up with automated reminders at 3, 7, and 14 day intervals.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Globe,
    title: "Email Campaigns",
    description:
      "Connect your SMTP, create campaigns, schedule sends, and track open rates and replies.",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: Shield,
    title: "Analytics Dashboard",
    description:
      "Track open rates, reply rates, conversion rates, and leads by industry and city.",
    color: "bg-indigo-100 text-indigo-600",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Find and Close Clients
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            LeadHunter AI combines lead discovery, website auditing, CRM, and
            outreach tools into one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div
                className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
