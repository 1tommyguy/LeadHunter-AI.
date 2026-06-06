"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does LeadHunter AI find businesses?",
    answer:
      "LeadHunter AI uses multiple data sources to discover local businesses in any city. It checks whether each business has a website, evaluates the quality of existing websites, and generates an opportunity score based on their digital presence.",
  },
  {
    question: "Is it safe to use for outreach?",
    answer:
      "Yes. LeadHunter AI is designed with responsible outreach in mind. All messages require your explicit approval before sending. We include rate limiting and safe sending controls to prevent spam-like behavior.",
  },
  {
    question: "How accurate is the website audit?",
    answer:
      "Our audit engine checks for website existence, mobile responsiveness, basic SEO factors, and page load speeds. While not a full SEO audit, it provides enough data to identify high-opportunity leads with around 85% accuracy.",
  },
  {
    question: "Can I try before I pay?",
    answer:
      "Yes! All plans include a 14-day free trial with no credit card required. You'll have access to all features during your trial period.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes 10 leads per month, basic lead finder, website audit, and the outreach generator. Perfect for testing the platform before upgrading.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.",
  },
  {
    question: "Do you offer agency pricing?",
    answer:
      "Yes! Our Agency plan includes unlimited leads, multiple team members, and white-label reports. Contact us for custom enterprise pricing if you need something more specific.",
  },
  {
    question: "Does LeadHunter AI work for any country?",
    answer:
      "LeadHunter AI works globally. You can search for businesses in any city and country. We have particular strength in finding leads in African, European, and Asian markets.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about LeadHunter AI.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span className="font-semibold text-gray-900">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
