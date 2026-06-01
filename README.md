# Backlos - Closure for Every Applicant ↺

**Backlos** is a production-ready B2B SaaS feedback delivery platform built to ensure that every applicant to any program (hackathons, accelerators, grants, job applications, fellowships) receives highly personalized, constructive, AI-generated feedback. No candidate gets ghosted.

This workspace houses the complete Next.js 14 App Router codebase optimized for PostgreSQL databases, Supabase RLS authentication, Resend SMTP emails, Stripe subscription limits, and Google Gemini API models.

---

## 🚀 Core Tech Stack

* **Framework**: Next.js 14 (App Router, TypeScript)
* **Database**: PostgreSQL (hosted on Supabase)
* **ORM**: Prisma
* **AI Engine**: Google Gemini API (`gemini-1.5-flash` with native JSON output models)
* **Email Service**: Resend + React Email templates
* **Billing System**: Stripe subscription tiers & quota limit meters
* **Background Runner**: Inngest
* **State Management**: Zustand
* **Styling**: Tailwind CSS with Space Grotesk brand design tokens

---

## 🛠️ Prerequisites & Environmental Configurations

Ensure that you copy and complete the environment configurations under your local [.env.local](file:///d:/2026-projects/Backlos/.env.local) profile:

```env
# SUPABASE AUTH & DATABASE
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DATABASE_URL=postgresql://postgres:your-db-password@db.your-supabase-project.supabase.co:5432/postgres?schema=public
DIRECT_URL=postgresql://postgres:your-db-password@db.your-supabase-project.supabase.co:5432/postgres?schema=public

# GOOGLE GEMINI API KEY
GEMINI_API_KEY=your-gemini-api-key

# RESEND EMAIL SERVICE
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=feedback@backlos.app

# STRIPE BILLING PRICE IDS
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
STRIPE_STARTER_PRICE_ID=price_starter_price_id
STRIPE_GROWTH_PRICE_ID=price_growth_price_id
STRIPE_SCALE_PRICE_ID=price_scale_price_id

# INNGEST BACKGROUND RUNNER
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key

# GENERAL SETTINGS
NEXT_PUBLIC_APP_URL=http://localhost:3000
FEEDBACK_TOKEN_SECRET=your_super_secret_feedback_hmac_sha256_token_key_here
```

---

## 💻 Local Setup & Execution Guide

### 1. Synchronize the Database Schema
Before launching the server, map the Prisma models to your Postgres database and compile the local Prisma Client library:
```bash
# Push database structures transactional maps
npx prisma db push

# Generate typescript models queries client
npx prisma generate
```

### 2. Launch Inngest Background Runner Server
Inngest orchestrates parallel AI generation queues and daily ghost-fighting alert schedulers. Run the local Inngest background dev server in a separate terminal:
```bash
npx Inngest-cli@latest dev
```
*Access the local control dashboard on `http://localhost:8288` to inspect event triggers and background task executions.*

### 3. Launch Dev Web Server
Launch your local web development server:
```bash
npm run dev
```
*Access the B2B portal console on `http://localhost:3000`.*

---

## 📈 Vercel Production Deployment Guide

1. Create a fresh project on **Vercel** and link it to this repository.
2. Populate all variables listed in `.env.local` inside Vercel's **Environment Variables** console settings.
3. Configure the **Build Command** to automatically synchronize Prisma models before deployment compilation:
   ```bash
   prisma generate && next build
   ```
4. Set up Stripe Webhooks on your Stripe Developer dashboard pointing to `https://your-production-app.vercel.app/api/webhooks/stripe`. Add signatures as `STRIPE_WEBHOOK_SECRET`.
5. Point the Inngest runner webhook triggers to `https://your-production-app.vercel.app/api/inngest` on your Inngest Cloud console.
