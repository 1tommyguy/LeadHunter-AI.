import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// One-time seed endpoint. Disable by setting SEED_DISABLED=true in env vars after first use.
export async function GET(req: NextRequest) {
  if (process.env.SEED_DISABLED === "true") {
    return NextResponse.json({ error: "Seeding is disabled" }, { status: 403 });
  }

  const token = req.nextUrl.searchParams.get("token");
  if (token !== "leadhunter-setup-2024") {
    return NextResponse.json({ error: "Pass ?token=leadhunter-setup-2024" }, { status: 401 });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: "demo@leadhunter.ai" } });
    if (existing) {
      return NextResponse.json({ message: "Already seeded — demo account exists.", email: "demo@leadhunter.ai" });
    }

    const hashedPassword = await bcrypt.hash("demo123456", 12);

    const demoUser = await prisma.user.create({
      data: {
        name: "Demo User",
        email: "demo@leadhunter.ai",
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    await prisma.subscription.create({
      data: {
        userId: demoUser.id,
        plan: "PRO",
        status: "ACTIVE",
        leadsLimit: 1000,
        leadsUsed: 23,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.settings.create({ data: { userId: demoUser.id } });

    const leads = await prisma.lead.createMany({
      data: [
        { userId: demoUser.id, businessName: "Golden Palace Restaurant", category: "Restaurant", city: "Lagos", country: "Nigeria", phone: "+2348012345678", hasWebsite: false, opportunityScore: 85, leadScore: 85, opportunity: "HIGH", status: "NEW", mobileScore: 0, seoScore: 0, rating: 4.2, auditedAt: new Date() },
        { userId: demoUser.id, businessName: "Smile Dental Clinic", category: "Dentist", city: "Abuja", country: "Nigeria", phone: "+2349087654321", website: "http://smiledental.com.ng", hasWebsite: true, websiteOutdated: true, opportunityScore: 65, leadScore: 65, opportunity: "MEDIUM", status: "CONTACTED", mobileScore: 35, seoScore: 28, rating: 4.7, auditedAt: new Date() },
        { userId: demoUser.id, businessName: "Lagos Grand Hotel", category: "Hotel", city: "Lagos", country: "Nigeria", website: "https://lagosgrand.com", email: "res@lagosgrand.com", hasWebsite: true, opportunityScore: 42, leadScore: 42, opportunity: "MEDIUM", status: "REPLIED", mobileScore: 55, seoScore: 48, rating: 4.5, auditedAt: new Date() },
        { userId: demoUser.id, businessName: "TopCuts Barber Shop", category: "Salon", city: "Port Harcourt", country: "Nigeria", hasWebsite: false, opportunityScore: 90, leadScore: 90, opportunity: "HIGH", status: "NEW", mobileScore: 0, seoScore: 0, rating: 3.9, auditedAt: new Date() },
        { userId: demoUser.id, businessName: "FitLife Gym", category: "Gym", city: "Lagos", country: "Nigeria", website: "http://fitlifegym.ng", hasWebsite: true, websiteOutdated: true, opportunityScore: 58, leadScore: 58, opportunity: "MEDIUM", status: "QUALIFIED", mobileScore: 42, seoScore: 35, rating: 4.1, auditedAt: new Date() },
        { userId: demoUser.id, businessName: "Bright Stars Primary School", category: "School", city: "Enugu", country: "Nigeria", hasWebsite: false, opportunityScore: 88, leadScore: 88, opportunity: "HIGH", status: "NEW", mobileScore: 0, seoScore: 0, rating: 4.3, auditedAt: new Date() },
      ],
    });

    await prisma.campaign.create({
      data: {
        userId: demoUser.id,
        name: "Lagos Restaurants Q1",
        description: "Targeting restaurants in Lagos without websites",
        type: "EMAIL",
        status: "ACTIVE",
        subject: "Get Your Restaurant Online Today",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      demoCredentials: { email: "demo@leadhunter.ai", password: "demo123456" },
      leadsCreated: leads.count,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
  }
}
