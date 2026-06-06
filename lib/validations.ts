import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const leadSearchSchema = z.object({
  businessType: z.string().min(1, "Business type is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  limit: z.number().min(1).max(50).default(20),
});

export const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  type: z.enum(["EMAIL", "CONTACT_FORM", "SOCIAL"]),
  template: z.string().optional(),
  subject: z.string().optional(),
  scheduledAt: z.string().optional(),
});

export const messageSchema = z.object({
  leadId: z.string().min(1),
  campaignId: z.string().optional(),
  subject: z.string().optional(),
  content: z.string().min(1, "Message content is required"),
  type: z.enum(["EMAIL", "CONTACT_FORM", "SMS"]).default("EMAIL"),
  status: z
    .enum(["DRAFT", "QUEUED", "SENT", "OPENED", "REPLIED", "BOUNCED", "ARCHIVED"])
    .default("DRAFT"),
  scheduledAt: z.string().optional(),
});

export const followUpSchema = z.object({
  leadId: z.string().min(1),
  dueAt: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
  type: z.enum(["EMAIL", "CALL", "MEETING"]).default("EMAIL"),
});

export const noteSchema = z.object({
  leadId: z.string().min(1),
  content: z.string().min(1, "Note content is required"),
});

export const smtpConfigSchema = z.object({
  host: z.string().min(1, "SMTP host is required"),
  port: z.number().min(1).max(65535).default(587),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  fromEmail: z.string().email("Invalid from email"),
  fromName: z.string().optional(),
  secure: z.boolean().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LeadSearchInput = z.infer<typeof leadSearchSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type FollowUpInput = z.infer<typeof followUpSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type SmtpConfigInput = z.infer<typeof smtpConfigSchema>;
