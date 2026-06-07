import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { auditWebsite, getOpportunityLevel } from "@/lib/lead-scorer";

const limiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

// Simulated business data for demo purposes
function generateMockBusinesses(
  businessType: string,
  city: string,
  country: string,
  count: number
) {
  const businesses = [];
  const hasWebsiteChance = 0.4;
  const categories = [businessType];

  const streetNames = [
    "Main St", "Victoria Island", "Lekki Phase 1", "Ikoyi", 
    "Ikeja GRA", "Maryland", "Yaba", "Surulere",
    "High Street", "King's Road", "Queens Ave"
  ];

  for (let i = 0; i < count; i++) {
    const hasWebsite = Math.random() > hasWebsiteChance;
    const websiteOutdated = hasWebsite && Math.random() > 0.6;
    const mobileScore = hasWebsite ? Math.floor(Math.random() * 60) + 20 : 0;
    const seoScore = hasWebsite ? Math.floor(Math.random() * 60) + 20 : 0;
    const rating = (Math.random() * 2 + 3).toFixed(1);

    let opportunityScore = 0;
    if (!hasWebsite) opportunityScore += 40;
    else if (websiteOutdated) opportunityScore += 25;
    if (mobileScore < 50) opportunityScore += 20;
    if (seoScore < 40) opportunityScore += 20;
    opportunityScore = Math.min(100, opportunityScore + Math.floor(Math.random() * 15));

    const opportunity = getOpportunityLevel(opportunityScore);
    const streetIndex = i % streetNames.length;

    businesses.push({
      businessName: `${businessType.charAt(0).toUpperCase() + businessType.slice(1)} ${String.fromCharCode(65 + (i % 26))} ${city}`,
      category: businessType,
      address: `${Math.floor(Math.random() * 200) + 1} ${streetNames[streetIndex]}, ${city}`,
      city,
      country,
      phone: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      website: hasWebsite ? `https://www.${businessType.toLowerCase().replace(/\s+/g, "")}${i + 1}${city.toLowerCase().replace(/\s+/g, "")}.com` : null,
      email: hasWebsite ? `info@${businessType.toLowerCase().replace(/\s+/g, "")}${i + 1}.com` : null,
      contactFormUrl: hasWebsite ? `https://www.${businessType.toLowerCase().replace(/\s+/g, "")}${i + 1}.com/contact` : null,
      rating: parseFloat(rating),
      hasWebsite,
      websiteOutdated,
      mobileScore,
      seoScore,
      opportunityScore,
      opportunity,
      leadScore: opportunityScore,
    });
  }

  return businesses.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export async function POST(req: NextRequest) {
  const rateLimitResult = await limiter(req);
  if (rateLimitResult) return rateLimitResult;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { businessType, city, country, limit = 20 } = body;

  if (!businessType || !city || !country) {
    return NextResponse.json(
      { error: "businessType, city, and country are required" },
      { status: 400 }
    );
  }

  // Check subscription limits
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription && subscription.leadsLimit !== -1) {
    if (subscription.leadsUsed >= subscription.leadsLimit) {
      return NextResponse.json(
        { error: "Monthly lead limit reached. Please upgrade your plan." },
        { status: 403 }
      );
    }
  }

  const searchCount = Math.min(limit, subscription?.leadsLimit === -1 ? 50 : Math.min(50, (subscription?.leadsLimit || 10) - (subscription?.leadsUsed || 0)));
  
  const businesses = generateMockBusinesses(businessType, city, country, searchCount);

  // Fetch user's name for outreach message signature
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });
  const senderName = user?.name || undefined;

  // Save leads to database
  const savedLeads = [];
  for (const biz of businesses) {
    const existing = await prisma.lead.findFirst({
      where: {
        userId: session.user.id,
        businessName: biz.businessName,
        city: biz.city,
      },
    });

    if (!existing) {
      const lead = await prisma.lead.create({
        data: {
          userId: session.user.id,
          ...biz,
          auditedAt: new Date(),
        },
      });

      // Auto-generate outreach message as draft signed with the user's name
      const { generateOutreachMessage } = await import("@/lib/lead-scorer");
      const messageContent = generateOutreachMessage("Website Design", {
        businessName: biz.businessName,
        category: biz.category,
        city: biz.city,
        hasWebsite: biz.hasWebsite,
        websiteOutdated: biz.websiteOutdated,
        mobileScore: biz.mobileScore,
        seoScore: biz.seoScore,
      }, senderName);

      await prisma.message.create({
        data: {
          userId: session.user.id,
          leadId: lead.id,
          subject: `Website Services for ${biz.businessName}`,
          content: messageContent,
          type: "EMAIL",
          status: "DRAFT",
        },
      });

      savedLeads.push(lead);
    }
  }

  // Update subscription usage
  if (subscription && savedLeads.length > 0) {
    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { leadsUsed: { increment: savedLeads.length } },
    });
  }

  return NextResponse.json({
    leads: businesses,
    saved: savedLeads.length,
    message: `Found ${businesses.length} businesses, saved ${savedLeads.length} new leads`,
  });
}
