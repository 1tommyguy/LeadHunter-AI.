# Deployment Guide — Go Live in 10 Minutes

## Step 1 — Free PostgreSQL Database (Neon)

1. Go to **https://neon.tech** → Sign up free (GitHub login works)
2. Click **"New Project"** → name it `leadhunter-ai`
3. Copy the **Connection String** — it looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this — you'll need it in Step 2.

---

## Step 2 — Deploy to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"** → select `1tommyguy/leadhunter-ai` (or `LeadHunter-AI.`)
3. Under **Environment Variables**, add these:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon connection string from Step 1 |
   | `NEXTAUTH_SECRET` | Run this and paste the result: `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | `https://your-project.vercel.app` (use your Vercel URL after first deploy) |

4. Click **Deploy** — Vercel builds and deploys automatically.

---

## Step 3 — Seed the Database

After your first deploy, open the **Vercel Dashboard → your project → Functions** tab or run locally with your Neon DATABASE_URL:

```bash
DATABASE_URL="your-neon-url" npm run db:push
DATABASE_URL="your-neon-url" npm run db:seed
```

This creates all tables and loads demo data.

---

## Done! 🎉

Your app is live at `https://your-project.vercel.app`

**Demo credentials:**
- Email: `demo@leadhunter.ai`
- Password: `demo123456`

---

## Fix NEXTAUTH_URL After First Deploy

After your first deploy, Vercel gives you a URL like `https://leadhunter-ai-abc123.vercel.app`.

Go to **Vercel → Settings → Environment Variables** and update `NEXTAUTH_URL` to that URL, then redeploy.

---

## Optional: Custom Domain

In **Vercel → your project → Settings → Domains**, add your custom domain (e.g. `app.leadhunter.ai`). Update `NEXTAUTH_URL` to match.

---

## Add Stripe Later (Optional)

When ready to accept payments:
1. Create a Stripe account at stripe.com
2. Add to Vercel env vars:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_STARTER_PRICE_ID`
   - `STRIPE_PRO_PRICE_ID`
   - `STRIPE_AGENCY_PRICE_ID`
3. The code is already wired up — just needs the keys.
