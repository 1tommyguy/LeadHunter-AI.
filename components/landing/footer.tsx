import Link from "next/link";
import { Target } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Target className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">LeadHunter AI</span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              The all-in-one platform for web professionals to find businesses
              that need websites and manage outreach campaigns.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Free Trial
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">
            © {new Date().getFullYear()} LeadHunter AI. All rights reserved.
          </p>
          <p className="text-sm mt-4 sm:mt-0">
            Built for web professionals worldwide 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}
