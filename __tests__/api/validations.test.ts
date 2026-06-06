import { registerSchema, loginSchema, leadSearchSchema, messageSchema, followUpSchema } from "@/lib/validations";

describe("Validations", () => {
  describe("registerSchema", () => {
    it("accepts valid registration data", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "securepass123",
        confirmPassword: "securepass123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "securepass123",
        confirmPassword: "different",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short passwords", () => {
      const result = registerSchema.safeParse({
        name: "John",
        email: "john@example.com",
        password: "short",
        confirmPassword: "short",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid emails", () => {
      const result = registerSchema.safeParse({
        name: "John",
        email: "not-an-email",
        password: "securepass123",
        confirmPassword: "securepass123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid credentials", () => {
      const result = loginSchema.safeParse({ email: "john@example.com", password: "password123" });
      expect(result.success).toBe(true);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({ email: "john@example.com", password: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("leadSearchSchema", () => {
    it("accepts valid search params", () => {
      const result = leadSearchSchema.safeParse({
        businessType: "Restaurant",
        city: "Lagos",
        country: "Nigeria",
        limit: 20,
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty businessType", () => {
      const result = leadSearchSchema.safeParse({ businessType: "", city: "Lagos", country: "Nigeria" });
      expect(result.success).toBe(false);
    });

    it("clamps limit to 50", () => {
      const result = leadSearchSchema.safeParse({
        businessType: "Hotel",
        city: "Lagos",
        country: "Nigeria",
        limit: 100,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("messageSchema", () => {
    it("accepts valid message", () => {
      const result = messageSchema.safeParse({
        leadId: "clz123",
        content: "Hello, I noticed your business...",
        type: "EMAIL",
        status: "DRAFT",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty content", () => {
      const result = messageSchema.safeParse({ leadId: "clz123", content: "", type: "EMAIL" });
      expect(result.success).toBe(false);
    });
  });

  describe("followUpSchema", () => {
    it("accepts valid follow-up", () => {
      const result = followUpSchema.safeParse({
        leadId: "clz123",
        dueAt: "2025-12-01",
        type: "EMAIL",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing dueAt", () => {
      const result = followUpSchema.safeParse({ leadId: "clz123", dueAt: "", type: "EMAIL" });
      expect(result.success).toBe(false);
    });
  });
});
