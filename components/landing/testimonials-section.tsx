import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Chidi Okafor",
    role: "Web Designer, Lagos",
    avatar: "CO",
    content:
      "LeadHunter AI transformed my freelance business. I went from struggling to find clients to having a pipeline of 50+ qualified leads every month. The website audit feature alone is worth the price.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Digital Marketing Agency, London",
    avatar: "SJ",
    content:
      "We use LeadHunter AI for all our local SEO client acquisition. The lead scoring is incredibly accurate — our close rate on 'High Opportunity' leads is over 40%.",
    rating: 5,
  },
  {
    name: "Marcus Adeleke",
    role: "Full-Stack Developer, Abuja",
    avatar: "MA",
    content:
      "The outreach generator creates messages that actually get responses. I've landed 3 new website clients in the past month just using the automated outreach templates.",
    rating: 5,
  },
  {
    name: "Emma Thompson",
    role: "Freelance Developer, Manchester",
    avatar: "ET",
    content:
      "Before LeadHunter AI, I spent hours manually searching for potential clients. Now I find 20+ qualified leads in minutes. The follow-up system ensures I never miss an opportunity.",
    rating: 5,
  },
  {
    name: "Ahmed Ibrahim",
    role: "SEO Consultant, Port Harcourt",
    avatar: "AI",
    content:
      "The analytics dashboard gives me deep insights into which business types and cities have the most opportunity. It's helped me focus my efforts where they matter most.",
    rating: 5,
  },
  {
    name: "Jennifer Chen",
    role: "Web Agency Owner, Singapore",
    avatar: "JC",
    content:
      "Our agency now uses LeadHunter AI as the foundation of our client acquisition strategy. The CRM integration means our whole team stays aligned on lead status.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Web Professionals Worldwide
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of freelancers and agencies growing their businesses
            with LeadHunter AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
