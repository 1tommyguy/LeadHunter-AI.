# LeadHunter AI 🎯

> **Find Businesses That Need Your Web Services — Automatically**

LeadHunter AI is a production-ready SaaS platform for freelancers, agencies, and web developers to discover businesses without websites, score leads by opportunity, generate personalized outreach messages, and manage their entire client pipeline.

---

## 🚀 Live Demo

- **Demo Email:** `demo@leadhunter.ai`
- **Demo Password:** `demo123456`

---

## ✨ Features

| Feature | Description |
|---|---|
| **Lead Finder** | Search any city + business type to discover local businesses |
| **Website Audit** | Automatically checks website presence, mobile score, and SEO |
| **Lead Scoring** | 0–100 opportunity score based on digital presence gaps |
| **Outreach Generator** | AI-generated personalized outreach for 4 service types |
| **Outreach Queue** | Draft → Approve → Send workflow with bulk actions |
| **CRM** | Kanban and list view with full pipeline management |
| **Follow-Up System** | Automated reminders at 3, 7, 14 days |
| **Email Campaigns** | Create and manage outreach campaigns |
| **Analytics** | Charts for leads by city, category, status, and over time |
| **Subscriptions** | Stripe-powered Starter / Pro / Agency plans |
| **Authentication** | Email/password + Google OAuth via NextAuth |

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + ShadCN UI
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth v5
- **Payments:** Stripe
- **Charts:** Recharts
- **Testing:** Jest + React Testing Library

---

## 📦 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/1tommyguy/leadhunter-ai.git
cd leadhunter-ai
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values — minimum required:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/leadhunter_ai"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # run: openssl rand -base64 32
```

### 3. Set Up Database

```bash
npm run db:push     # push schema to database
npm run db:seed     # seed with demo data
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | App URL (http://localhost:3000 in dev) |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing |
| `GOOGLE_CLIENT_ID` | Optional | For Google OAuth login |
| `GOOGLE_CLIENT_SECRET` | Optional | For Google OAuth login |
| `STRIPE_SECRET_KEY` | Optional | For payment processing |
| `STRIPE_WEBHOOK_SECRET` | Optional | For Stripe webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Stripe public key |
| `STRIPE_STARTER_PRICE_ID` | Optional | Starter plan price ID |
| `STRIPE_PRO_PRICE_ID` | Optional | Pro plan price ID |
| `STRIPE_AGENCY_PRICE_ID` | Optional | Agency plan price ID |
| `SMTP_HOST` | Optional | SMTP host for email sending |
| `SMTP_PORT` | Optional | SMTP port |
| `SMTP_USER` | Optional | SMTP username |
| `SMTP_PASS` | Optional | SMTP password |

---

## 🚢 Deployment on Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/1tommyguy/leadhunter-ai)

### Manual Deploy

1. Push to GitHub
2. Import repo in [Vercel Dashboard](https://vercel.com/new)
3. Add all environment variables
4. Set build command: `npm run build`
5. Set output directory: `.next`
6. Deploy!

### Post-Deploy

Run database migrations:
```bash
npx prisma db push
npx prisma db seed
```

---

## 📁 Project Structure

```
leadhunter-ai/
├── app/
│   ├── (auth)/           # Login, Register, Forgot Password
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── dashboard/    # Main dashboard with stats
│   │   ├── leads/        # Lead list and finder
│   │   ├── outreach/     # Outreach queue
│   │   ├── crm/          # CRM kanban + lead details
│   │   ├── campaigns/    # Email campaigns
│   │   ├── followups/    # Follow-up reminders
│   │   ├── analytics/    # Charts and metrics
│   │   ├── settings/     # SMTP, profile, security
│   │   └── subscription/ # Plan management
│   ├── api/              # API routes
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # ShadCN UI components
│   ├── landing/          # Landing page sections
│   └── layout/           # Sidebar, TopNav
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── stripe.ts         # Stripe configuration
│   ├── lead-scorer.ts    # Lead scoring & outreach
│   ├── rate-limit.ts     # Rate limiting middleware
│   └── validations.ts    # Zod schemas
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── __tests__/            # Unit and integration tests
```

---

## 🧪 Testing

```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

---

## 📜 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run type-check` | TypeScript type checking |

---

## 🔒 Security

- Rate limiting on all API endpoints
- Input validation with Zod schemas
- CSRF protection via NextAuth
- Password hashing with bcryptjs (12 rounds)
- JWT session tokens
- SQL injection prevention via Prisma ORM
- No automated bulk email sending — all messages require explicit user approval

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
