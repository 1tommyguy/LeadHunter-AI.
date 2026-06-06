# LeadHunter AI

> AI-powered lead generation platform for web professionals

LeadHunter AI helps freelancers, agencies, and web developers find local businesses that need web services, score them by opportunity, generate personalized outreach, and manage the entire client pipeline — all in one place.

**[Visit the live app →](https://lead-hunter-ai-yzis.vercel.app)**

---

## What It Does

**Find leads** — Search any city and business category. The platform discovers local businesses and automatically checks whether they have a website, how their mobile performance scores, and how they rank for SEO.

**Score by opportunity** — Every lead gets a 0–100 score based on digital presence gaps. A restaurant with no website in a major city scores higher than one with a modern site.

**Generate outreach** — Personalized messages for four service types: Website Design, SEO, Digital Marketing, and Business Automation. Messages are saved as drafts and only send when you approve them.

**Manage the pipeline** — A full CRM with Kanban and list views. Move leads through stages, add notes, schedule follow-ups, and track everything in one place.

**Track performance** — Analytics dashboard with charts for leads by city, category, pipeline stage, and growth over time.

---

## Features

- Lead finder with city + category search
- Automatic website, mobile, and SEO auditing
- 0–100 lead opportunity scoring
- Outreach message generator (4 templates)
- Outreach queue with draft → approve → send workflow
- CRM pipeline (Kanban + list view)
- Lead detail pages with notes and activity
- Follow-up scheduler with type labels (Call, Email, LinkedIn, Meeting)
- Email campaign management
- Analytics dashboard with Recharts
- Subscription plan management
- Email/password authentication
- Google OAuth (enable by adding credentials)
- Secure JWT sessions with NextAuth v5

---

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS + ShadCN UI components
- **Database** — PostgreSQL via Prisma ORM (compatible with Neon, Supabase, Railway)
- **Auth** — NextAuth v5 with Credentials and Google providers
- **Charts** — Recharts
- **Testing** — Jest + React Testing Library
- **Deployment** — Vercel

---

## Deploy Your Own

### 1. Database (free with Neon)

Create a free PostgreSQL database at [neon.tech](https://neon.tech) and copy the connection string.

### 2. One-click deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/1tommyguy/LeadHunter-AI.)

Set these three environment variables during setup:

```
DATABASE_URL      → your Neon connection string
NEXTAUTH_SECRET   → run: openssl rand -base64 32
NEXTAUTH_URL      → your Vercel deployment URL (e.g. https://myapp.vercel.app)
```

### 3. Initialize the database

After your first deploy, open this URL in your browser (replace the domain):

```
https://your-app.vercel.app/api/seed?token=leadhunter-setup-2024
```

This creates all tables and loads sample data so the app is immediately usable.

---

## Local Development

```bash
git clone https://github.com/1tommyguy/LeadHunter-AI.
cd LeadHunter-AI.
npm install --legacy-peer-deps
cp .env.example .env        # fill in DATABASE_URL and NEXTAUTH_SECRET
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Random secret — `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Your app's public URL |
| `GOOGLE_CLIENT_ID` | No | Enables Google OAuth login |
| `GOOGLE_CLIENT_SECRET` | No | Enables Google OAuth login |
| `SMTP_HOST` | No | Email sending (e.g. smtp.gmail.com) |
| `SMTP_PORT` | No | SMTP port (typically 587) |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_FROM` | No | Sender email address |

---

## Project Structure

```
app/
├── (auth)/              # Login, register, password reset
├── (dashboard)/         # All authenticated pages
│   ├── dashboard/       # Overview with stats and activity
│   ├── leads/           # Lead list with search and filters
│   ├── leads/finder/    # Search businesses by city and type
│   ├── outreach/queue/  # Manage outreach message queue
│   ├── crm/             # Lead pipeline (Kanban + list)
│   ├── crm/[id]/        # Lead detail — notes, follow-ups, outreach
│   ├── campaigns/       # Email campaign management
│   ├── followups/       # Follow-up tracker
│   ├── analytics/       # Charts and reporting
│   ├── settings/        # Profile, SMTP config, security
│   └── subscription/    # Plan management
├── api/                 # REST API endpoints
└── page.tsx             # Public landing page

components/
├── ui/                  # Reusable UI primitives (Button, Card, Dialog, etc.)
├── landing/             # Landing page sections
└── layout/              # Sidebar and top navigation

lib/
├── auth.ts              # NextAuth configuration
├── lead-scorer.ts       # Scoring algorithm and outreach generator
├── prisma.ts            # Database client singleton
└── validations.ts       # Zod schemas for all forms and API inputs

prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Sample data loader
```

---

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run test             # Run test suite
npm run test:coverage    # Coverage report
npm run db:push          # Push schema to database
npm run db:seed          # Load sample data
npm run db:studio        # Open Prisma Studio GUI
npm run type-check       # TypeScript validation
```

---

## Security

- Session-authenticated API routes — unauthenticated requests return 401
- Zod validation on all inputs at API boundaries
- bcryptjs password hashing (12 rounds)
- Rate limiting on auth and search endpoints
- Prisma parameterized queries prevent SQL injection
- JWT tokens — no server-side session storage required

---

## License

MIT — use it, fork it, build on it.
