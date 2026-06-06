"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              LeadHunter AI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              FAQ
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
