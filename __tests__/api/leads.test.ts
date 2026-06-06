import { calculateLeadScore, getOpportunityLevel, generateOutreachMessage } from "@/lib/lead-scorer";

describe("Lead Scorer", () => {
  describe("calculateLeadScore", () => {
    it("returns 40+ for businesses without a website", () => {
      const score = calculateLeadScore({
        hasWebsite: false,
        websiteOutdated: false,
        mobileScore: 0,
        seoScore: 0,
        opportunityScore: 0,
        opportunity: "LOW",
      });
      expect(score).toBeGreaterThanOrEqual(40);
    });

    it("returns lower score for businesses with good websites", () => {
      const score = calculateLeadScore({
        hasWebsite: true,
        websiteOutdated: false,
        mobileScore: 90,
        seoScore: 85,
        opportunityScore: 0,
        opportunity: "LOW",
      });
      expect(score).toBeLessThan(40);
    });

    it("caps at 100", () => {
      const score = calculateLeadScore({
        hasWebsite: false,
        websiteOutdated: true,
        mobileScore: 10,
        seoScore: 10,
        opportunityScore: 0,
        opportunity: "LOW",
      });
      expect(score).toBeLessThanOrEqual(100);
    });

    it("adds score for outdated website", () => {
      const withOutdated = calculateLeadScore({
        hasWebsite: true,
        websiteOutdated: true,
        mobileScore: 80,
        seoScore: 80,
        opportunityScore: 0,
        opportunity: "LOW",
      });
      const withoutOutdated = calculateLeadScore({
        hasWebsite: true,
        websiteOutdated: false,
        mobileScore: 80,
        seoScore: 80,
        opportunityScore: 0,
        opportunity: "LOW",
      });
      expect(withOutdated).toBeGreaterThan(withoutOutdated);
    });
  });

  describe("getOpportunityLevel", () => {
    it("returns HIGH for score >= 70", () => {
      expect(getOpportunityLevel(70)).toBe("HIGH");
      expect(getOpportunityLevel(95)).toBe("HIGH");
    });

    it("returns MEDIUM for score 40-69", () => {
      expect(getOpportunityLevel(40)).toBe("MEDIUM");
      expect(getOpportunityLevel(69)).toBe("MEDIUM");
    });

    it("returns LOW for score < 40", () => {
      expect(getOpportunityLevel(0)).toBe("LOW");
      expect(getOpportunityLevel(39)).toBe("LOW");
    });
  });

  describe("generateOutreachMessage", () => {
    const baseLead = {
      businessName: "Test Business",
      category: "Restaurant",
      city: "Lagos",
      hasWebsite: false,
      websiteOutdated: false,
      mobileScore: 0,
      seoScore: 0,
    };

    it("generates a message for businesses without websites", () => {
      const msg = generateOutreachMessage("Website Design", baseLead);
      expect(msg).toContain("Test Business");
      expect(msg.length).toBeGreaterThan(100);
    });

    it("generates SEO-specific message for SEO template", () => {
      const msg = generateOutreachMessage("SEO Services", { ...baseLead, hasWebsite: true });
      expect(msg).toContain("SEO");
    });

    it("generates digital marketing message", () => {
      const msg = generateOutreachMessage("Digital Marketing", baseLead);
      expect(msg).toContain("marketing");
    });

    it("generates automation message", () => {
      const msg = generateOutreachMessage("Business Automation", baseLead);
      expect(msg).toContain("automat");
    });

    it("mentions the city in the message", () => {
      const msg = generateOutreachMessage("Website Design", baseLead);
      expect(msg).toContain("Lagos");
    });
  });
});
