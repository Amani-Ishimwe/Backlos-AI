import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import { getPlanDetails, STRIPE_PLANS } from "@/lib/stripe";
import BillingPortalActions from "./BillingPortalActions";

export default async function BillingConsolePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch organization details
  const membership = await prisma.orgMember.findFirst({
    where: { userId: user.id },
    include: {
      org: true,
    },
  });

  if (!membership) return null;
  const { org } = membership;

  // 2. Fetch current month applicant usage
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const activeUsage = await prisma.applicant.count({
    where: {
      program: { orgId: org.id },
      createdAt: { gte: startOfMonth },
    },
  });

  const planDetails = getPlanDetails(org.plan);
  const limit = planDetails.limit;
  
  // Usage calculations
  const usagePercent = limit > 0 ? (activeUsage / limit) * 100 : 0;
  
  // Decide usage meter color based on thresholds (amber at 80%, red at 95%)
  const getUsageColor = (percent: number) => {
    if (percent >= 95) return "red" as const;
    if (percent >= 80) return "amber" as const;
    return "purple" as const;
  };

  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      priceId: STRIPE_PLANS.STARTER.priceId,
      limit: "200 applicants / mo",
      features: [
        "Gemini AI closure reviews",
        "Interactive Rubric Builder",
        "CSV batch intake scores",
        "Branded Resend dispatches",
        "Public Accountability score",
      ],
      current: org.plan === "STARTER",
      cta: org.plan === "STARTER" ? "Current Plan" : "Upgrade Starter",
    },
    {
      name: "Growth",
      price: "$199",
      priceId: STRIPE_PLANS.GROWTH.priceId,
      limit: "2,000 applicants / mo",
      features: [
        "Everything in Starter plan",
        "Priority parallel queue compilations",
        "Anti-Ghosting active cron alerts",
        "Public white-labeled portals",
        "Custom organization avatars",
      ],
      current: org.plan === "GROWTH",
      cta: org.plan === "GROWTH" ? "Current Plan" : "Upgrade Growth",
      popular: true,
    },
    {
      name: "Scale",
      price: "$599",
      priceId: STRIPE_PLANS.SCALE.priceId,
      limit: "10,000 applicants / mo",
      features: [
        "Everything in Growth plan",
        "Gemini-Pro advanced models",
        "Guaranteed priority dispatches",
        "Dedicated Database Clusters",
        "24/7 Priority support hotline",
      ],
      current: org.plan === "SCALE",
      cta: org.plan === "SCALE" ? "Current Plan" : "Upgrade Scale",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="pb-4 border-b border-brand-light">
        <h1 className="text-2xl font-bold text-brand-text">Billing Console</h1>
        <p className="text-sm text-brand-muted mt-1">
          Manage your subscription plans, check monthly candidate intake usage quotas, and synchronize checkouts.
        </p>
      </div>

      {/* Usage Meter Card */}
      <Card className="border-brand-border shadow-premium">
        <CardHeader className="flex flex-row items-center justify-between border-b border-brand-light pb-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Active Usage Quota</CardTitle>
            <CardDescription>Reset date: 1st day of next calendar month</CardDescription>
          </div>
          <Badge variant="primary" className="text-xs uppercase font-bold tracking-wider">
            {org.plan} Tier
          </Badge>
        </CardHeader>
        
        <CardContent className="py-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-text">
            <span>Served Candidates (This Month)</span>
            <span>
              {activeUsage} / {limit === Infinity ? "Unlimited" : limit}
            </span>
          </div>

          <div className="w-full h-3 bg-brand-light border border-brand-border rounded-badge overflow-hidden">
            <div
              className={`h-full rounded-badge transition-all duration-500 ease-out ${
                getUsageColor(usagePercent) === "red"
                  ? "bg-rose-500"
                  : getUsageColor(usagePercent) === "amber"
                  ? "bg-amber-500"
                  : "bg-brand-primary"
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-brand-muted font-semibold leading-normal pt-2">
            <span>
              {usagePercent >= 95 
                ? "🚨 CRITICAL: Quota almost full. AI queue feedback generation will be locked soon!" 
                : usagePercent >= 80 
                ? "⚠️ Warning: You have consumed 80% of your plan limit." 
                : "Quotas sync automatically in real-time."}
            </span>
            {org.stripeSubscriptionId && (
              <BillingPortalActions label="Manage Billing Profile" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Pricing Grid */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-brand-text">Sane B2B Pricing Tiers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((p) => (
            <Card
              key={p.name}
              className={`p-8 border-1.5 flex flex-col justify-between relative bg-white
                ${p.popular ? "border-brand-primary shadow-lg ring-1 ring-brand-primary" : "border-brand-border shadow-premium"}`}
            >
              {p.popular && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-brand-light text-brand-primary text-[10px] font-bold uppercase tracking-wider rounded-badge select-none">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-brand-text">{p.name}</h3>
                  <Badge variant="primary" className="text-[10px] mt-1.5 uppercase font-bold tracking-wider">
                    {p.limit}
                  </Badge>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold tracking-tight text-brand-text">{p.price}</span>
                  <span className="text-xs font-semibold text-brand-muted">/ month</span>
                </div>

                <ul className="space-y-3 pt-6 border-t border-slate-100 text-xs text-brand-text font-semibold">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-emerald-500 font-bold mr-2 select-none">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                {p.current ? (
                  <Button variant="secondary" className="w-full font-bold" disabled>
                    Active Current Plan
                  </Button>
                ) : (
                  <BillingPortalActions
                    priceId={p.priceId}
                    label={p.cta}
                    className="w-full font-bold"
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
