"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  Mail,
  Bell,
  BarChart3,
  Settings,
  CreditCard,
  Target,
  MessageSquare,
  InboxIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lead Finder", href: "/dashboard/leads/finder", icon: Search },
  { name: "My Leads", href: "/dashboard/leads", icon: Users },
  { name: "Outreach Queue", href: "/dashboard/outreach/queue", icon: InboxIcon },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Mail },
  { name: "CRM", href: "/dashboard/crm", icon: MessageSquare },
  { name: "Follow-Ups", href: "/dashboard/followups", icon: Bell },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <Target className="h-8 w-8 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">LeadHunter AI</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-900 mb-1">Free Plan</p>
          <p className="text-xs text-blue-700">10 leads/month</p>
          <Link
            href="/dashboard/subscription"
            className="mt-2 block text-xs font-medium text-blue-600 hover:underline"
          >
            Upgrade now →
          </Link>
        </div>
      </div>
    </aside>
  );
}
