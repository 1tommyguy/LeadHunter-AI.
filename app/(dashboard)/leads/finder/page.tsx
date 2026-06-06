"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { leadSearchSchema, type LeadSearchInput } from "@/lib/validations";
import {
  Search,
  Loader2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface LeadResult {
  businessName: string;
  category: string;
  address: string;
  city: string;
  country: string;
  phone: string | null;
  website: string | null;
  email: string | null;
  rating: number | null;
  hasWebsite: boolean;
  websiteOutdated: boolean;
  mobileScore: number;
  seoScore: number;
  opportunityScore: number;
  opportunity: "HIGH" | "MEDIUM" | "LOW";
  leadScore: number;
}

const opportunityColors = {
  HIGH: "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW: "bg-red-100 text-red-700 border-red-200",
};

const businessTypes = [
  "Restaurant",
  "Hotel",
  "Dentist",
  "Pharmacy",
  "Lawyer",
  "Accountant",
  "Plumber",
  "Electrician",
  "Salon",
  "Gym",
  "Clinic",
  "School",
  "Church",
  "Real Estate",
  "Car Dealer",
  "Supermarket",
];

export default function LeadFinderPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LeadResult[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LeadSearchInput>({
    resolver: zodResolver(leadSearchSchema),
    defaultValues: { limit: 20 },
  });

  const onSubmit = async (data: LeadSearchInput) => {
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: "Search failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      setResults(result.leads);
      setSavedCount(result.saved);
      toast({
        title: "Search complete!",
        description: result.message,
      });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Finder</h1>
        <p className="text-gray-600 mt-1">
          Search for businesses that need your web services
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search for Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  placeholder="e.g. Restaurant, Dentist, Hotel"
                  {...register("businessType")}
                  list="business-types"
                />
                <datalist id="business-types">
                  {businessTypes.map((type) => (
                    <option key={type} value={type} />
                  ))}
                </datalist>
                {errors.businessType && (
                  <p className="text-sm text-red-600">
                    {errors.businessType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g. Lagos, London, New York"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="e.g. Nigeria, UK, USA"
                  {...register("country")}
                />
                {errors.country && (
                  <p className="text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Leads
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Quick search:</span>
            {[
              { type: "Restaurant", city: "Lagos", country: "Nigeria" },
              { type: "Dentist", city: "Abuja", country: "Nigeria" },
              { type: "Hotel", city: "Port Harcourt", country: "Nigeria" },
              { type: "Salon", city: "London", country: "UK" },
            ].map((quick) => (
              <button
                key={`${quick.type}-${quick.city}`}
                type="button"
                onClick={() => {
                  setValue("businessType", quick.type);
                  setValue("city", quick.city);
                  setValue("country", quick.country);
                }}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
              >
                {quick.type}s in {quick.city}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              {results.length} businesses found
              {savedCount > 0 && (
                <span className="ml-2 text-sm font-normal text-green-600">
                  ({savedCount} saved as new leads)
                </span>
              )}
            </h2>
            <div className="flex gap-2 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                High
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Low
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {results.map((lead, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  lead.opportunity === "HIGH"
                    ? "border-l-green-500"
                    : lead.opportunity === "MEDIUM"
                    ? "border-l-yellow-500"
                    : "border-l-red-400"
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {lead.businessName}
                      </h3>
                      <p className="text-sm text-gray-500">{lead.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {lead.opportunityScore}
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {lead.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        {lead.address}
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        {lead.phone}
                      </div>
                    )}
                    {lead.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                        {lead.email}
                      </div>
                    )}
                    {lead.rating && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-3.5 w-3.5 flex-shrink-0 text-yellow-400 fill-yellow-400" />
                        {lead.rating} rating
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-center mb-1">
                        {lead.hasWebsite ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-gray-600">Website</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-900">
                        {lead.mobileScore || "N/A"}
                      </div>
                      <div className="text-gray-600">Mobile</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-900">
                        {lead.seoScore || "N/A"}
                      </div>
                      <div className="text-gray-600">SEO</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${
                        opportunityColors[lead.opportunity]
                      }`}
                    >
                      {lead.opportunity === "HIGH" ? "🔥" : lead.opportunity === "MEDIUM" ? "⚡" : "📊"}{" "}
                      {lead.opportunity} Opportunity
                    </span>
                    {lead.websiteOutdated && (
                      <span className="flex items-center gap-1 text-xs text-orange-600">
                        <AlertTriangle className="h-3 w-3" />
                        Outdated site
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
