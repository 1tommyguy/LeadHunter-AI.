import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Target, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="info" className="mb-6 text-sm px-4 py-1.5">
            AI-Powered Lead Generation for Web Professionals
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Find Businesses That{" "}
            <span className="text-blue-600">Need Your Services</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            LeadHunter AI automatically discovers local businesses without
            websites or with outdated web presence. Reach out with personalized
            messages and close more deals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border">
              <Search className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Find Leads</h3>
              <p className="text-sm text-gray-600 text-center">
                Search any city for businesses needing web services
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border">
              <Target className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Score & Qualify</h3>
              <p className="text-sm text-gray-600 text-center">
                AI scores each lead based on opportunity potential
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Close Deals</h3>
              <p className="text-sm text-gray-600 text-center">
                Send personalized outreach and track conversions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
