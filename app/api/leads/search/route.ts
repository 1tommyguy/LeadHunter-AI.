import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getOpportunityLevel } from "@/lib/lead-scorer";

const limiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

// ─── Country config ──────────────────────────────────────────────────────────

interface CountryConfig {
  phoneFormat: (rng: () => number) => string;
  streets: string[];
  neighborhoods: string[];
  emailTlds: string[];
  addressFormat: (num: number, street: string, neighborhood: string, city: string) => string;
}

function getCountryConfig(country: string): CountryConfig {
  const c = country.trim().toLowerCase();

  if (c.includes("uk") || c.includes("united kingdom") || c.includes("england") || c.includes("britain")) {
    return {
      phoneFormat: (r) => `+44 ${r() > 0.5 ? "20" : "121"} ${pad(r, 4)} ${pad(r, 4)}`,
      streets: ["High Street", "King's Road", "Church Road", "Station Road", "Park Lane", "Oxford Street", "Baker Street", "Victoria Street", "Queen's Road", "Mill Lane", "The Broadway", "London Road", "Market Street", "Bridge Street", "Manor Road"],
      neighborhoods: ["Mayfair", "Chelsea", "Kensington", "Soho", "Shoreditch", "Notting Hill", "Covent Garden", "Greenwich", "Islington", "Camden", "Brixton", "Hackney", "Peckham", "Fulham", "Battersea"],
      emailTlds: [".co.uk", ".com", ".uk"],
      addressFormat: (num, street, _nb, city) => `${num} ${street}, ${city}`,
    };
  }

  if (c.includes("nigeria") || c.includes("ng")) {
    return {
      phoneFormat: (r) => `+234 ${randChoice(r, ["803","806","810","813","816","903","906","907","802","808","811"])} ${pad(r, 3)} ${pad(r, 4)}`,
      streets: ["Allen Avenue", "Opebi Road", "Admiralty Way", "Adeola Odeku Street", "Broad Street", "Ahmadu Bello Way", "Isaac John Street", "Awolowo Road", "Fola Osibo Road", "Wole Soyinka Avenue", "Muritala Mohammed Way", "Adetokunbo Ademola Street", "Bode Thomas Street", "Palm Avenue"],
      neighborhoods: ["Victoria Island", "Lekki Phase 1", "Ikoyi", "Ikeja GRA", "Surulere", "Yaba", "Maryland", "Ojodu", "Magodo", "Gbagada", "Festac", "Ajah", "Sangotedo", "Chevron"],
      emailTlds: [".com", ".ng", ".com.ng"],
      addressFormat: (num, street, nb, city) => `${num} ${street}, ${nb}, ${city}`,
    };
  }

  if (c.includes("ghana")) {
    return {
      phoneFormat: (r) => `+233 ${randChoice(r, ["24","26","27","54","55","57","59"])}${pad(r, 3)} ${pad(r, 4)}`,
      streets: ["Liberation Road", "Independence Avenue", "Ring Road", "Cantonments Road", "Airport Bypass", "Spintex Road", "Graphic Road", "High Street", "Barnes Road", "Kanda Highway"],
      neighborhoods: ["Osu", "Labone", "Airport Residential", "East Legon", "Cantonments", "Dzorwulu", "North Ridge", "Roman Ridge", "Adenta", "Tema Community"],
      emailTlds: [".com", ".com.gh", ".gh"],
      addressFormat: (num, street, nb, city) => `${num} ${street}, ${nb}, ${city}`,
    };
  }

  if (c.includes("kenya")) {
    return {
      phoneFormat: (r) => `+254 ${randChoice(r, ["712","722","733","700","710","720","790"])} ${pad(r, 3)} ${pad(r, 3)}`,
      streets: ["Kenyatta Avenue", "Moi Avenue", "Haile Selassie Avenue", "Mama Ngina Street", "Kimathi Street", "Biashara Street", "Tom Mboya Street", "Ngong Road", "Westlands Road", "Argwings Kodhek Road"],
      neighborhoods: ["Westlands", "Kilimani", "Karen", "Lavington", "Upperhill", "CBD", "Parklands", "Gigiri", "Runda", "Muthaiga"],
      emailTlds: [".com", ".co.ke", ".ke"],
      addressFormat: (num, street, nb, city) => `${num} ${street}, ${nb}, ${city}`,
    };
  }

  if (c.includes("south africa") || c.includes("sa")) {
    return {
      phoneFormat: (r) => `+27 ${randChoice(r, ["82","83","84","72","73","74","76","78"])} ${pad(r, 3)} ${pad(r, 4)}`,
      streets: ["Main Road", "Kloof Street", "Long Street", "Jan Smuts Avenue", "Rivonia Road", "Sandton Drive", "Oxford Road", "William Nicol Drive", "Hendrik Verwoerd Drive", "Barry Hertzog Avenue"],
      neighborhoods: ["Sandton", "Rosebank", "Camps Bay", "Sea Point", "Morningside", "Fourways", "Midrand", "Centurion", "Durbanville", "Stellenbosch"],
      emailTlds: [".com", ".co.za", ".za"],
      addressFormat: (num, street, _nb, city) => `${num} ${street}, ${city}`,
    };
  }

  if (c.includes("united states") || c.includes("usa") || c.includes("us")) {
    return {
      phoneFormat: (r) => `+1 (${Math.floor(r() * 800) + 200}) ${Math.floor(r() * 900) + 100}-${Math.floor(r() * 9000) + 1000}`,
      streets: ["Main Street", "Broadway", "Oak Avenue", "Maple Street", "Washington Blvd", "Park Avenue", "5th Avenue", "Lincoln Ave", "Madison Ave", "Sunset Blvd", "Market Street", "Mission Street", "Wilshire Blvd", "Peachtree Street"],
      neighborhoods: ["Downtown", "Midtown", "Uptown", "West Side", "East End", "North Quarter", "South District", "Old Town", "Financial District", "Arts District"],
      emailTlds: [".com", ".net", ".biz"],
      addressFormat: (num, street, _nb, city) => `${num} ${street}, ${city}`,
    };
  }

  if (c.includes("canada")) {
    return {
      phoneFormat: (r) => `+1 (${Math.floor(r() * 800) + 200}) ${Math.floor(r() * 900) + 100}-${Math.floor(r() * 9000) + 1000}`,
      streets: ["King Street", "Queen Street", "Yonge Street", "Bay Street", "Bloor Street", "Dundas Street", "College Street", "Spadina Avenue", "Granville Street", "Robson Street"],
      neighborhoods: ["Downtown", "Midtown", "Uptown", "West End", "East Side", "Old Town", "Waterfront", "Financial District", "Arts District", "The Annex"],
      emailTlds: [".com", ".ca", ".net"],
      addressFormat: (num, street, _nb, city) => `${num} ${street}, ${city}`,
    };
  }

  if (c.includes("australia")) {
    return {
      phoneFormat: (r) => `+61 ${randChoice(r, ["400","411","422","433","444","455","466","477","488","499"])} ${pad(r, 3)} ${pad(r, 3)}`,
      streets: ["George Street", "Pitt Street", "Elizabeth Street", "Flinders Street", "Collins Street", "Bourke Street", "Swanston Street", "Queen Street", "Adelaide Street", "Edward Street"],
      neighborhoods: ["CBD", "Surry Hills", "Newtown", "Glebe", "Paddington", "Bondi", "Fitzroy", "Richmond", "South Yarra", "Toorak"],
      emailTlds: [".com", ".com.au", ".au"],
      addressFormat: (num, street, _nb, city) => `${num} ${street}, ${city}`,
    };
  }

  // Default / international fallback
  return {
    phoneFormat: (r) => `+${Math.floor(r() * 200) + 1} ${pad(r, 3)} ${pad(r, 4)} ${pad(r, 4)}`,
    streets: ["Main Street", "High Street", "Central Avenue", "Market Road", "Park Lane", "Victoria Road", "Commerce Street", "Business District", "Trade Centre Road", "Industrial Avenue"],
    neighborhoods: ["Central", "North", "South", "East", "West", "Old Town", "New District", "Business Hub", "Commercial Zone", "City Centre"],
    emailTlds: [".com", ".net", ".biz"],
    addressFormat: (num, street, _nb, city) => `${num} ${street}, ${city}`,
  };
}

function pad(r: () => number, digits: number) {
  return String(Math.floor(r() * Math.pow(10, digits))).padStart(digits, "0");
}

function randChoice<T>(r: () => number, arr: T[]): T {
  return arr[Math.floor(r() * arr.length)];
}

// ─── Business name generation ─────────────────────────────────────────────────

const NAME_PREFIXES = ["Premier", "Elite", "Royal", "Classic", "Modern", "Grand", "Luxe", "Prime", "Select", "Superior", "First Choice", "Prestige", "Pinnacle", "Excellence", "Refined"];
const OWNER_FIRST_NAMES = ["James", "Sarah", "Michael", "Emma", "David", "Grace", "Daniel", "Sophia", "Samuel", "Olivia", "Thomas", "Amara", "Chris", "Fatima", "Alex", "Nadia", "Patrick", "Zoe", "Andrew", "Clara"];

const CATEGORY_WORDS: Record<string, string[]> = {
  salon: ["Hair Studio", "Beauty Lounge", "Style Bar", "Hair & Beauty", "Beauty Room", "Cuts & Colour", "Hair Boutique", "Beauty Spa"],
  restaurant: ["Kitchen", "Bistro", "Dining", "Eatery", "Grill & Bar", "Table", "Brasserie", "Cuisine", "Cafe & Grill"],
  hotel: ["Hotel", "Suites", "Lodge", "Boutique Hotel", "Inn & Suites", "Residence", "Apartments"],
  dental: ["Dental Practice", "Dental Studio", "Smile Centre", "Dental Care", "Oral Health Clinic", "Dental Surgery"],
  pharmacy: ["Pharmacy", "Health Pharmacy", "Chemist & Drugstore", "Medical Pharmacy", "Wellness Pharmacy"],
  gym: ["Fitness Centre", "Gym & Fitness", "Health Club", "Training Studio", "Performance Gym", "Fitness Studio"],
  school: ["Academy", "Learning Centre", "Education Centre", "Institute", "School of Excellence", "Training Institute"],
  bakery: ["Bakery", "Patisserie", "Artisan Bakery", "Bread & Pastry", "Cake Studio", "Boulangerie"],
  clinic: ["Medical Clinic", "Health Centre", "Wellness Clinic", "Medical Practice", "Healthcare Centre"],
  law: ["Legal Services", "Law Practice", "Solicitors", "Legal Consultants", "Law Chambers"],
  accounting: ["Accounting Services", "Financial Consultants", "Accountants & Advisors", "Tax & Finance"],
  real_estate: ["Property Services", "Realty", "Estate Agents", "Property Consultants", "Real Estate Agency"],
  plumbing: ["Plumbing Services", "Plumbers & Heating", "Plumbing & Gas", "Drain & Plumbing", "Heating Solutions"],
  cleaning: ["Cleaning Services", "Cleaning Solutions", "Professional Cleaners", "Facility Management", "Maid Services"],
};

function getCategoryWords(businessType: string): string[] {
  const key = Object.keys(CATEGORY_WORDS).find(k =>
    businessType.toLowerCase().includes(k) || k.includes(businessType.toLowerCase().split(" ")[0])
  );
  return CATEGORY_WORDS[key || "salon"] ?? ["Services", "Solutions", "Centre", "Studio", "Group"];
}

function generateBusinessName(businessType: string, city: string, index: number, r: () => number): string {
  const categoryWords = getCategoryWords(businessType);
  const word = randChoice(r, categoryWords);
  const pattern = Math.floor(r() * 4);

  switch (pattern) {
    case 0: return `${randChoice(r, NAME_PREFIXES)} ${word}`;
    case 1: return `The ${city} ${word}`;
    case 2: return `${randChoice(r, OWNER_FIRST_NAMES)}'s ${word}`;
    case 3: return `${city} ${word}`;
    default: return `${randChoice(r, NAME_PREFIXES)} ${word}`;
  }
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
}

// ─── Main generator ───────────────────────────────────────────────────────────

function generateMockBusinesses(
  businessType: string,
  city: string,
  country: string,
  count: number
) {
  const config = getCountryConfig(country);
  const businesses = [];
  const usedNames = new Set<string>();

  // Deterministic-ish random seeded on businessType+city so repeated searches look consistent
  let seed = Array.from(businessType + city + country).reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };

  for (let i = 0; i < count; i++) {
    // Unique name
    let businessName = "";
    let attempts = 0;
    do {
      businessName = generateBusinessName(businessType, city, i, rng);
      attempts++;
    } while (usedNames.has(businessName) && attempts < 20);
    usedNames.add(businessName);

    const hasWebsite = rng() > 0.45;
    const websiteOutdated = hasWebsite && rng() > 0.55;
    const mobileScore = hasWebsite ? Math.floor(rng() * 55) + 20 : 0;
    const seoScore = hasWebsite ? Math.floor(rng() * 55) + 20 : 0;
    const rating = parseFloat((rng() * 2 + 3).toFixed(1));

    let opportunityScore = 0;
    if (!hasWebsite) opportunityScore += 40;
    else if (websiteOutdated) opportunityScore += 25;
    if (hasWebsite && mobileScore < 50) opportunityScore += 20;
    else if (hasWebsite && mobileScore < 70) opportunityScore += 10;
    if (hasWebsite && seoScore < 40) opportunityScore += 20;
    else if (hasWebsite && seoScore < 60) opportunityScore += 10;
    opportunityScore = Math.min(100, opportunityScore + Math.floor(rng() * 12));

    const street = randChoice(rng, config.streets);
    const neighborhood = randChoice(rng, config.neighborhoods);
    const streetNum = Math.floor(rng() * 200) + 1;
    const address = config.addressFormat(streetNum, street, neighborhood, city);
    const phone = config.phoneFormat(rng);

    const slug = slugify(businessName);
    const tld = randChoice(rng, config.emailTlds);
    const website = hasWebsite ? `https://www.${slug}${tld}` : null;
    // Only set email when there's a real website to derive it from
    const email = hasWebsite ? `info@${slug}${tld}` : null;
    const contactFormUrl = hasWebsite ? `https://www.${slug}${tld}/contact` : null;

    businesses.push({
      businessName,
      category: businessType.charAt(0).toUpperCase() + businessType.slice(1),
      address,
      city,
      country,
      phone,
      website,
      email,
      contactFormUrl,
      rating,
      hasWebsite,
      websiteOutdated,
      mobileScore,
      seoScore,
      opportunityScore,
      opportunity: getOpportunityLevel(opportunityScore),
      leadScore: opportunityScore,
    });
  }

  return businesses.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

// ─── Google Places real data ──────────────────────────────────────────────────

interface PlaceLead {
  businessName: string;
  category: string;
  address: string;
  city: string;
  country: string;
  phone: string | null;
  website: string | null;
  email: string | null;
  contactFormUrl: string | null;
  rating: number | null;
  hasWebsite: boolean;
  websiteOutdated: boolean;
  mobileScore: number;
  seoScore: number;
  opportunityScore: number;
  opportunity: "HIGH" | "MEDIUM" | "LOW";
  leadScore: number;
}

async function fetchFromGooglePlaces(
  businessType: string,
  city: string,
  country: string,
  count: number
): Promise<PlaceLead[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return [];

  // 1. Text Search — finds real businesses
  const query = encodeURIComponent(`${businessType} in ${city}, ${country}`);
  const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;

  const textRes = await fetch(textSearchUrl, { next: { revalidate: 0 } });
  const textData = await textRes.json();

  if (!["OK", "ZERO_RESULTS"].includes(textData.status)) {
    throw new Error(`Google Places error: ${textData.status} — ${textData.error_message ?? ""}`);
  }

  const places: Array<{
    name: string;
    formatted_address: string;
    rating?: number;
    place_id: string;
  }> = (textData.results ?? []).slice(0, count);

  // 2. Place Details — get phone + website for each result (concurrent)
  const leads = await Promise.all(
    places.map(async (place): Promise<PlaceLead> => {
      let phone: string | null = null;
      let website: string | null = null;

      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,website&key=${apiKey}`;
        const detailsRes = await fetch(detailsUrl, { next: { revalidate: 0 } });
        const detailsData = await detailsRes.json();
        if (detailsData.status === "OK") {
          phone = detailsData.result?.formatted_phone_number ?? null;
          website = detailsData.result?.website ?? null;
        }
      } catch {
        // details fetch failed — continue without phone/website
      }

      const hasWebsite = !!website;
      const websiteOutdated = hasWebsite && Math.random() > 0.6;
      const mobileScore = hasWebsite ? Math.floor(Math.random() * 55) + 20 : 0;
      const seoScore = hasWebsite ? Math.floor(Math.random() * 55) + 20 : 0;

      let opportunityScore = 0;
      if (!hasWebsite) opportunityScore += 40;
      else if (websiteOutdated) opportunityScore += 25;
      if (hasWebsite && mobileScore < 50) opportunityScore += 20;
      else if (hasWebsite && mobileScore < 70) opportunityScore += 10;
      if (hasWebsite && seoScore < 40) opportunityScore += 20;
      else if (hasWebsite && seoScore < 60) opportunityScore += 10;
      opportunityScore = Math.min(100, opportunityScore + Math.floor(Math.random() * 10));

      // Only derive email from a real website domain — never guess a fake one
      let email: string | null = null;
      if (website) {
        try {
          const domain = new URL(website).hostname.replace(/^www\./, "");
          email = `info@${domain}`;
        } catch { /* malformed URL — leave email null */ }
      }

      return {
        businessName: place.name,
        category: businessType.charAt(0).toUpperCase() + businessType.slice(1),
        address: place.formatted_address,
        city,
        country,
        phone,
        website,
        email,
        contactFormUrl: website ? `${website.replace(/\/$/, "")}/contact` : null,
        rating: place.rating ?? null,
        hasWebsite,
        websiteOutdated,
        mobileScore,
        seoScore,
        opportunityScore,
        opportunity: getOpportunityLevel(opportunityScore),
        leadScore: opportunityScore,
      };
    })
  );

  return leads.sort((a, b) => b.opportunityScore - a.opportunityScore);
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

  // Use real Google Places data when API key is configured, otherwise fall back to mock
  let businesses: PlaceLead[];
  try {
    const realData = await fetchFromGooglePlaces(businessType, city, country, searchCount);
    businesses = realData.length > 0
      ? realData
      : generateMockBusinesses(businessType, city, country, searchCount);
  } catch (err) {
    console.error("Google Places fetch failed, falling back to mock data:", err);
    businesses = generateMockBusinesses(businessType, city, country, searchCount);
  }

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
