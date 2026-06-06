import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getOpportunityColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

export function getOpportunityLabel(score: number): string {
  if (score >= 70) return "High Opportunity";
  if (score >= 40) return "Medium Opportunity";
  return "Low Opportunity";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    CONTACTED: "bg-yellow-100 text-yellow-700",
    REPLIED: "bg-green-100 text-green-700",
    QUALIFIED: "bg-purple-100 text-purple-700",
    CLOSED: "bg-gray-100 text-gray-700",
    DRAFT: "bg-gray-100 text-gray-700",
    QUEUED: "bg-blue-100 text-blue-700",
    SENT: "bg-green-100 text-green-700",
    OPENED: "bg-purple-100 text-purple-700",
    REPLIED_MSG: "bg-green-100 text-green-700",
    BOUNCED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-gray-100 text-gray-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
