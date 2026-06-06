import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LeadHunter AI - Find Businesses That Need Websites",
  description:
    "LeadHunter AI helps freelancers, agencies, and web developers find businesses that need websites and manage outreach campaigns.",
  keywords: "lead generation, web design leads, SEO leads, business finder",
  openGraph: {
    title: "LeadHunter AI",
    description: "Find businesses that need websites and grow your client base",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
