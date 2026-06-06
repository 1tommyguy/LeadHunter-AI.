interface AuditResult {
  hasWebsite: boolean;
  websiteOutdated: boolean;
  mobileScore: number;
  seoScore: number;
  opportunityScore: number;
  opportunity: "HIGH" | "MEDIUM" | "LOW";
}

export function calculateLeadScore(audit: AuditResult): number {
  let score = 0;

  if (!audit.hasWebsite) score += 40;
  else if (audit.websiteOutdated) score += 25;

  if (audit.mobileScore < 50) score += 20;
  else if (audit.mobileScore < 70) score += 10;

  if (audit.seoScore < 40) score += 20;
  else if (audit.seoScore < 60) score += 10;

  return Math.min(100, score);
}

export function getOpportunityLevel(score: number): "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export async function auditWebsite(url: string | null): Promise<AuditResult> {
  if (!url) {
    return {
      hasWebsite: false,
      websiteOutdated: false,
      mobileScore: 0,
      seoScore: 0,
      opportunityScore: 90,
      opportunity: "HIGH",
    };
  }

  // Simulate website audit - in production integrate with PageSpeed Insights API
  const mobileScore = Math.floor(Math.random() * 60) + 20;
  const seoScore = Math.floor(Math.random() * 60) + 20;
  const websiteOutdated = Math.random() > 0.6;

  const hasWebsite = true;
  const opportunityScore = calculateAuditScore({
    hasWebsite,
    websiteOutdated,
    mobileScore,
    seoScore,
    opportunityScore: 0,
  });

  return {
    hasWebsite,
    websiteOutdated,
    mobileScore,
    seoScore,
    opportunityScore,
    opportunity: getOpportunityLevel(opportunityScore),
  };
}

function calculateAuditScore(audit: Omit<AuditResult, "opportunity">): number {
  let score = 0;

  if (!audit.hasWebsite) score += 40;
  else if (audit.websiteOutdated) score += 25;

  if (audit.mobileScore < 50) score += 20;
  else if (audit.mobileScore < 70) score += 10;

  if (audit.seoScore < 40) score += 20;
  else if (audit.seoScore < 60) score += 10;

  return Math.min(100, score);
}

export function generateOutreachMessage(
  template: string,
  lead: {
    businessName: string;
    category: string;
    city: string;
    hasWebsite: boolean;
    websiteOutdated: boolean;
    mobileScore: number;
    seoScore: number;
  }
): string {
  const templates: Record<string, string> = {
    "Website Design": generateWebsiteDesignMessage(lead),
    "SEO Services": generateSEOMessage(lead),
    "Digital Marketing": generateDigitalMarketingMessage(lead),
    "Business Automation": generateAutomationMessage(lead),
  };

  return templates[template] || generateWebsiteDesignMessage(lead);
}

function generateWebsiteDesignMessage(lead: {
  businessName: string;
  category: string;
  city: string;
  hasWebsite: boolean;
  websiteOutdated: boolean;
  mobileScore: number;
}): string {
  if (!lead.hasWebsite) {
    return `Hi ${lead.businessName} team,

I came across your ${lead.category} business in ${lead.city} and noticed you don't have a website yet. In today's digital age, having a professional website is essential for attracting new customers and growing your business.

I specialize in creating modern, mobile-friendly websites specifically for ${lead.category} businesses. I'd love to help you establish a strong online presence that:

• Attracts new customers searching online
• Showcases your services professionally
• Works perfectly on mobile devices
• Loads fast and ranks well on Google

I offer affordable packages starting from $499 and can have your site live within 2 weeks.

Would you be open to a quick 15-minute call to discuss how we can help grow your business online?

Best regards,
[Your Name]`;
  }

  if (lead.websiteOutdated || lead.mobileScore < 60) {
    return `Hi ${lead.businessName} team,

I recently visited your website and noticed it could benefit from some modern updates. With mobile searches now accounting for over 60% of web traffic, having a mobile-optimized website is critical for your ${lead.category} business in ${lead.city}.

I help local businesses like yours upgrade their online presence to:

• Improve mobile experience (your current mobile score needs attention)
• Speed up page load times
• Update the design to convert more visitors into customers
• Improve local SEO to get found in Google searches

I'd be happy to share a free website audit showing exactly what improvements could make the biggest difference for your business.

Can we schedule a quick call this week?

Best regards,
[Your Name]`;
  }

  return `Hi ${lead.businessName} team,

I specialize in helping ${lead.category} businesses in ${lead.city} attract more customers through their websites. I noticed your business and wanted to reach out about some opportunities to improve your online presence.

Would you be interested in a free consultation?

Best regards,
[Your Name]`;
}

function generateSEOMessage(lead: {
  businessName: string;
  category: string;
  city: string;
  seoScore: number;
}): string {
  return `Hi ${lead.businessName} team,

I noticed that your ${lead.category} business in ${lead.city} isn't ranking as highly as it could on Google searches. With targeted SEO improvements, you could be attracting significantly more local customers.

My SEO services specifically help ${lead.category} businesses:

• Rank #1 in Google for searches like "${lead.category} in ${lead.city}"
• Increase organic website traffic by 200-400%
• Build local citations and Google Business Profile
• Create content that converts visitors into customers

I recently helped a similar business in your area increase their monthly leads by 3x within 6 months.

I'd love to share a free SEO audit for your business. When would be a good time to connect?

Best regards,
[Your Name]`;
}

function generateDigitalMarketingMessage(lead: {
  businessName: string;
  category: string;
  city: string;
}): string {
  return `Hi ${lead.businessName} team,

Are you getting the most out of your digital marketing? Many ${lead.category} businesses in ${lead.city} are missing out on a huge opportunity to reach local customers online.

I help businesses like yours with:

• Google Ads campaigns that generate real leads
• Social media marketing that builds your brand
• Email marketing that keeps customers coming back
• Analytics tracking so you know what's working

I work specifically with ${lead.category} businesses, so I understand your market and customer base.

Would you be interested in a free 30-minute strategy session? I'll share specific ideas for growing your business online.

Best regards,
[Your Name]`;
}

function generateAutomationMessage(lead: {
  businessName: string;
  category: string;
  city: string;
}): string {
  return `Hi ${lead.businessName} team,

Running a ${lead.category} business in ${lead.city} means wearing many hats. I help businesses like yours automate time-consuming tasks so you can focus on what you do best.

Business automation solutions I offer:

• Automated appointment scheduling and reminders
• Customer follow-up email sequences
• Online booking and payment processing
• CRM to manage customer relationships
• Automated review request campaigns

My clients typically save 10-15 hours per week while increasing customer satisfaction and retention.

I'd love to show you a demo of what's possible for your specific business. Are you available for a quick call this week?

Best regards,
[Your Name]`;
}
