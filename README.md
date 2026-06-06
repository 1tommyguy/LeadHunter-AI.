<div align="center">

# 🎯 LeadHunter AI

### Find businesses that need your web services — automatically.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://lead-hunter-ai-yzis.vercel.app)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/1tommyguy/LeadHunter-AI.)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-99%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

<br/>

> LeadHunter AI is a full-stack SaaS platform that helps freelancers, agencies, and web developers **discover local businesses without websites**, score them by opportunity, generate personalized outreach messages, and close more clients — all from one dashboard.

</div>

---

## ✨ Key Features

| | Feature | Description |
|---|---|---|
| 🔍 | **Lead Finder** | Search any city + business type to discover businesses needing web services |
| 📊 | **AI Lead Scoring** | Automatic 0–100 opportunity score based on website gaps, mobile, and SEO |
| ✉️ | **Outreach Generator** | Personalized messages for Website Design, SEO, Marketing & Automation |
| 📋 | **CRM Pipeline** | Kanban + list view — New → Contacted → Replied → Qualified → Closed |
| 🔔 | **Follow-Up System** | Schedule follow-ups (Call, Email, LinkedIn) with smart reminders |
| 📈 | **Analytics** | Charts for leads by city, category, status, and growth over time |
| 📣 | **Campaigns** | Create and manage outreach campaigns across your leads |
| 🔐 | **Auth** | Secure email/password login + Google OAuth ready |
| 💳 | **Subscription Plans** | Free / Starter / Pro / Agency plan management |

---

## 🚀 Live Demo

**[→ Try it live at lead-hunter-ai-yzis.vercel.app](https://lead-hunter-ai-yzis.vercel.app)**

Create a free account on the site, or use the pre-loaded demo account to explore all features instantly.

---

## 🛠 Tech Stack

```
Next.js 15 (App Router)    →  Framework
TypeScript                 →  Language
Tailwind CSS + ShadCN UI   →  Styling & Components
PostgreSQL + Prisma ORM    →  Database
NextAuth v5                →  Authentication
Recharts                   →  Analytics Charts
Jest + RTL                 →  Testing
Vercel                     →  Deployment
Neon                       →  Managed PostgreSQL (free tier)
```

---

## ⚡ Deploy in 5 Minutes (Free)

### Step 1 — Get a free database

Sign up at [neon.tech](https://neon.tech) → New Project → copy your connection string.

### Step 2 — Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/1tommyguy/LeadHunter-AI.)

Add these 3 environment variables:

```bash
DATABASE_URL      # your Neon PostgreSQL connection string
NEXTAUTH_SECRET   # generate: openssl rand -base64 32
NEXTAUTH_URL      # your Vercel app URL, e.g. https://myapp.vercel.app
```

### Step 3 — Load sample data

Visit this URL once after your deploy (replace with your domain):

```
https://your-app.vercel.app/api/seed?token=leadhunter-setup-2024
```

**That's it — your app is live.** 🎉

---

## 💻 Local Development

```bash
# 1. Clone the repo
git clone https://github.com/1tommyguy/LeadHunter-AI.
cd LeadHunter-AI.

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Set up environment variables
cp .env.example .env
# → fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# 4. Set up the database
npx prisma generate
npx prisma db push
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 🔑 Environment Variables

**Required to run:**

```env
DATABASE_URL="postgresql://..."        # PostgreSQL connection string
NEXTAUTH_SECRET="..."                  # Random secret (openssl rand -base64 32)
NEXTAUTH_URL="https://your-app.com"    # Your app's public URL
```

**Optional — unlock extra features:**

```env
# Google OAuth (adds "Sign in with Google" button)
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

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Login · Register · Password Reset
│   ├── (dashboard)/         # All authenticated app pages
│   │   ├── dashboard/       # Overview with stats + recent activity
│   │   ├── leads/           # Lead list with search & filters
│   │   ├── leads/finder/    # Discover businesses by city & type
│   │   ├── outreach/queue/  # Approve & manage outreach messages
│   │   ├── crm/             # Pipeline board + lead detail pages
│   │   ├── campaigns/       # Email campaign management
│   │   ├── followups/       # Follow-up tracker & reminders
│   │   ├── analytics/       # Charts and reporting
│   │   ├── settings/        # Profile, SMTP config, security
│   │   └── subscription/    # Plan management
│   ├── api/                 # REST API endpoints
│   └── page.tsx             # Public landing page
│
├── components/
│   ├── ui/                  # Button, Card, Dialog, Input, etc.
│   ├── landing/             # Hero, Features, Pricing, FAQ
│   └── layout/              # Sidebar + Top Navigation
│
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── lead-scorer.ts       # Scoring algorithm + outreach generator
│   ├── prisma.ts            # Database client
│   └── validations.ts       # Zod schemas
│
└── prisma/
    ├── schema.prisma        # Full database schema
    └── seed.ts              # Sample data
```

---

## 🔒 Security

- ✅ All dashboard routes protected — unauthenticated requests redirect to login
- ✅ Zod validation on every API endpoint
- ✅ Passwords hashed with bcryptjs (12 rounds)
- ✅ Rate limiting on auth and search routes
- ✅ Prisma parameterized queries — SQL injection safe
- ✅ JWT sessions — no server-side session storage needed
- ✅ Outreach messages require manual approval before sending

---

## 📜 Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run test             # Run test suite
npm run test:coverage    # Test coverage report
npm run db:push          # Push schema to database
npm run db:seed          # Load sample data
npm run db:studio        # Open Prisma Studio GUI
npm run type-check       # TypeScript check
```

---

## 🤝 Contributing

Pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

[MIT](LICENSE) — free to use, fork, and build on.

---

<div align="center">

Built with ❤️ for web professionals who want more clients.

**[⭐ Star this repo](https://github.com/1tommyguy/LeadHunter-AI.)** if you find it useful!

</div>
