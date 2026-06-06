import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123456", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@leadhunter.ai" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@leadhunter.ai",
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Demo user created: ${demoUser.email}`);

  // Create subscription for demo user
  await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      plan: "PRO",
      status: "ACTIVE",
      leadsLimit: 1000,
      leadsUsed: 23,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Create settings
  await prisma.settings.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      emailNotifications: true,
      followUpReminders: true,
    },
  });

  // Create sample leads
  const sampleLeads = [
    { businessName: "Golden Palace Restaurant", category: "Restaurant", city: "Lagos", country: "Nigeria", address: "15 Victoria Island, Lagos", phone: "+2348012345678", website: null, email: "info@goldenpalace.ng", opportunityScore: 85, opportunity: "HIGH" as const, status: "NEW" as const, hasWebsite: false, mobileScore: 0, seoScore: 0, rating: 4.2 },
    { businessName: "Smile Dental Clinic", category: "Dentist", city: "Abuja", country: "Nigeria", address: "24 Garki District, Abuja", phone: "+2349087654321", website: "http://smiledental.com.ng", email: null, opportunityScore: 65, opportunity: "MEDIUM" as const, status: "CONTACTED" as const, hasWebsite: true, websiteOutdated: true, mobileScore: 35, seoScore: 28, rating: 4.7 },
    { businessName: "Lagos Grand Hotel", category: "Hotel", city: "Lagos", country: "Nigeria", address: "10 Ikoyi, Lagos", phone: "+2348098765432", website: "https://lagosgrand.com", email: "reservations@lagosgrand.com", opportunityScore: 42, opportunity: "MEDIUM" as const, status: "REPLIED" as const, hasWebsite: true, websiteOutdated: false, mobileScore: 55, seoScore: 48, rating: 4.5 },
    { businessName: "TopCuts Barber Shop", category: "Salon", city: "Port Harcourt", country: "Nigeria", address: "5 GRA Phase 2, PH", phone: "+2348054321987", website: null, email: null, opportunityScore: 90, opportunity: "HIGH" as const, status: "NEW" as const, hasWebsite: false, mobileScore: 0, seoScore: 0, rating: 3.9 },
    { businessName: "FitLife Gym", category: "Gym", city: "Lagos", country: "Nigeria", address: "22 Lekki Phase 1", phone: "+2348011223344", website: "http://fitlifegym.ng", email: "hello@fitlifegym.ng", opportunityScore: 58, opportunity: "MEDIUM" as const, status: "QUALIFIED" as const, hasWebsite: true, websiteOutdated: true, mobileScore: 42, seoScore: 35, rating: 4.1 },
    { businessName: "Bright Stars Primary School", category: "School", city: "Enugu", country: "Nigeria", address: "88 Independence Layout, Enugu", phone: "+2348022334455", website: null, email: null, opportunityScore: 88, opportunity: "HIGH" as const, status: "NEW" as const, hasWebsite: false, mobileScore: 0, seoScore: 0, rating: 4.3 },
  ];

  const createdLeads = [];
  for (const lead of sampleLeads) {
    const created = await prisma.lead.create({
      data: { userId: demoUser.id, leadScore: lead.opportunityScore, auditedAt: new Date(), ...lead },
    });
    createdLeads.push(created);
  }

  console.log(`✅ ${createdLeads.length} sample leads created`);

  // Create sample messages (drafts) for first lead
  await prisma.message.create({
    data: {
      userId: demoUser.id,
      leadId: createdLeads[0].id,
      subject: `Website Services for ${createdLeads[0].businessName}`,
      content: `Hi ${createdLeads[0].businessName} team,\n\nI noticed you don't have a website yet. In today's digital world, a professional website is essential for attracting new customers.\n\nI'd love to help you establish a strong online presence. Would you be open to a quick call?\n\nBest,\nDemo User`,
      type: "EMAIL",
      status: "DRAFT",
    },
  });

  await prisma.message.create({
    data: {
      userId: demoUser.id,
      leadId: createdLeads[1].id,
      subject: `Website Redesign for ${createdLeads[1].businessName}`,
      content: `Hi ${createdLeads[1].businessName},\n\nI visited your website and noticed it could benefit from some modern updates. Would you be interested in a free audit?\n\nBest,\nDemo User`,
      type: "EMAIL",
      status: "SENT",
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Sample follow-ups
  await prisma.followUp.create({
    data: {
      userId: demoUser.id,
      leadId: createdLeads[1].id,
      dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      notes: "Check if they received the email",
      type: "EMAIL",
    },
  });

  await prisma.followUp.create({
    data: {
      userId: demoUser.id,
      leadId: createdLeads[0].id,
      dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      notes: "Initial outreach follow-up",
      type: "EMAIL",
    },
  });

  // Sample note
  await prisma.note.create({
    data: {
      userId: demoUser.id,
      leadId: createdLeads[2].id,
      content: "Spoke to manager John. He's interested in a mobile-first redesign. Budget ~$2,000. Follow up next week.",
    },
  });

  // Sample campaign
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

  console.log("✅ Sample campaigns, notes, follow-ups created");
  console.log("\n🎉 Seed complete!");
  console.log("\nDemo credentials:");
  console.log("  Email: demo@leadhunter.ai");
  console.log("  Password: demo123456");
  console.log("  URL: http://localhost:3000/login");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
