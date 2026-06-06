# LeadHunter AI

**Find businesses that need your web services — automatically.**

LeadHunter AI is a production-ready SaaS platform for freelancers, agencies, and web developers to discover local businesses without websites, score leads by opportunity, generate personalized outreach messages, and manage their entire client pipeline.

**Live App:** [lead-hunter-ai-yzis.vercel.app](https://lead-hunter-ai-yzis.vercel.app)

---

## Demo

Log in instantly with the demo account:

| Field | Value |
|---|---|
| Email | `demo@leadhunter.ai` |
| Password | `demo123456` |

---

## Features

### Lead Finder
Search any city and business type. The system discovers local businesses, checks whether they have a website, audits mobile performance and SEO, and assigns a 0–100 opportunity score automatically.

### Lead Scoring
Every lead is automatically scored based on:
- No website = highest priority
- Outdated/non-mobile website = high priority
- Low SEO score = medium priority

### Outreach Generator
Generates personalized outreach messages in 4 styles — Website Design, SEO Services, Digital Marketing, and Business Automation. Messages are saved as drafts and require your approval before sending.

### CRM Pipeline
Kanban board and list view. Move leads through: **New → Contacted → Replied → Qualified → Closed**. Add notes and schedule follow-ups on each lead's detail page.

### Follow-Up System
Create timed follow-ups (3, 7, 14 days) with type labels: Call, Email, LinkedIn, Meeting. Dashboard shows upcoming follow-ups at a glance.

### Email Campaigns
Create named outreach campaigns, assign leads, and track message status.

### Analytics
Charts for leads by city, business category, pipeline status, and growth over time.

### Authentication
Email/password login and registration. Google OAuth ready (add credentials to enable). Secure JWT sessions via NextAuth v5.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + ShadCN UI |
| Database | PostgreSQL (Neon) + Prisma ORM |
| Auth | NextAuth v5 |
| Charts | Recharts |
| Testing | Jest + React Testing Library |
| Deployment | Vercel |

---

## Deploy Your Own (Free)

### Step 1 — Free Database

Go to [neon.tech](https://neon.tech), create a free project, copy the connection string.

### Step 2 — Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/1tommyguy/LeadHunter-AI.)

Add these environment variables in Vercel:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` and paste result |
| `NEXTAUTH_URL` | Your Vercel deployment URL |

### Step 3 — Load Demo Data

After deploy, open these URLs in your browser (replace with your Vercel URL):

```
https://your-app.vercel.app/api/seed?token=leadhunter-setup-2024
```

That's it. Log in with `demo@leadhunter.ai` / `demo123456`.

---

## Local Development

```bash
# Clone
git clone https://github.com/1tommyguy/LeadHunter-AI.
cd LeadHunter-AI.

# Install
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Set up database
npx prisma generate
npx prisma db push

# Seed demo data
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

**Required:**

```env
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="https://your-app.vercel.app"
```

**Optional:**

```env
# Google OAuth (enables "Sign in with Google")
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email sending via SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="noreply@yourdomain.com"
```

---

## Project Structure

```
app/
├── (auth)/             # Login, Register, Forgot Password
├── (dashboard)/        # All protected pages
│   ├── dashboard/      # Overview with stats + recent leads
│   ├── leads/          # Lead list with search/filter
│   ├── leads/finder/   # Lead finder (search by city + type)
│   ├── outreach/queue/ # Approve and manage outreach messages
│   ├── crm/            # Kanban board + lead detail
│   ├── campaigns/      # Email campaign management
│   ├── followups/      # Follow-up tracker
│   ├── analytics/      # Charts and metrics
│   ├── settings/       # Profile, SMTP, security
│   └── subscription/   # Plan management
├── api/                # REST API routes
└── page.tsx            # Landing page

components/
├── ui/                 # Button, Card, Input, Dialog, etc.
├── landing/            # Hero, Features, Pricing, FAQ sections
└── layout/             # Sidebar and TopNav

lib/
├── auth.ts             # NextAuth config
├── lead-scorer.ts      # Scoring algorithm + outreach generator
├── prisma.ts           # Database client
└── validations.ts      # Zod validation schemas

prisma/
├── schema.prisma       # Full database schema
└── seed.ts             # Demo data seeder
```

---

## Available Scripts

```bash
npm run dev             # Development server
npm run build           # Production build
npm run test            # Run tests
npm run test:coverage   # Test coverage report
npm run db:push         # Push schema to database
npm run db:seed         # Seed demo data
npm run db:studio       # Open Prisma Studio GUI
npm run type-check      # TypeScript check
```

---

## Security

- All API routes protected with session authentication
- Input validation with Zod on every endpoint
- Passwords hashed with bcryptjs (12 rounds)
- Rate limiting on auth and search endpoints
- JWT session tokens (no server-side sessions needed)
- SQL injection prevention via Prisma parameterized queries

---

## License

MIT — free to use, fork, and build on.
