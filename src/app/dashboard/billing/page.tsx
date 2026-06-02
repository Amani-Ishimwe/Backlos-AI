import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getPlanDetails, STRIPE_PLANS } from "@/lib/stripe";
import BillingPortalActions from "./BillingPortalActions";
import { MotionContainer, MotionItem } from "@/components/layout/MotionWrapper";
import { CreditCard, Zap, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

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
    if (percent >= 95) return "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]";
    if (percent >= 80) return "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    return "bg-brand-primary shadow-[0_0_15px_rgba(108,99,255,0.5)]";
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
    <MotionContainer className="space-y-8 pb-10">
      {/* Title Header */}
      <MotionItem className="pb-4 border-b border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing Console</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your subscription plans, check monthly candidate intake usage quotas, and synchronize checkouts.
          </p>
        </div>
        {org.stripeSubscriptionId && (
          <BillingPortalActions label="Manage Billing Profile" />
        )}
      </MotionItem>

      {/* Usage Meter Card - Premium Redesign */}
      <MotionItem className="bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Usage Quota</h2>
              </div>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Reset date: 1st day of next calendar month</p>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <span className="text-xs text-slate-400 font-semibold">Current Tier:</span>
              <span className="text-sm font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/10 px-2 py-0.5 rounded-md">
                {org.plan}
              </span>
            </div>
          </div>
          
          <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/80">
            <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
              <span>Served Candidates (This Month)</span>
              <span className="text-white">
                <span className="text-2xl">{activeUsage}</span> <span className="text-slate-500">/ {limit === Infinity ? "Unlimited" : limit}</span>
              </span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner mb-4">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${getUsageColor(usagePercent)}`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>

            <div className="flex items-center text-xs font-medium">
              {usagePercent >= 95 ? (
                <span className="flex items-center text-rose-400 font-bold">
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  CRITICAL: Quota almost full. AI queue feedback generation will be locked soon!
                </span>
              ) : usagePercent >= 80 ? (
                <span className="flex items-center text-amber-400 font-bold">
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  Warning: You have consumed 80% of your plan limit.
                </span>
              ) : (
                <span className="flex items-center text-slate-400">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
                  Quotas sync automatically in real-time.
                </span>
              )}
            </div>
          </div>
        </div>
      </MotionItem>

      {/* Subscription Pricing Grid */}
      <MotionItem className="space-y-6 pt-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sane B2B Pricing Tiers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((p) => (
            <div
              key={p.name}
              className={`p-8 rounded-[2rem] flex flex-col justify-between relative bg-white transition-all duration-300
                ${p.popular 
                  ? "border-2 border-brand-primary shadow-[0_20px_40px_rgba(108,99,255,0.15)] md:-translate-y-2 z-10 scale-[1.02]" 
                  : "border border-slate-200 shadow-sm hover:shadow-md"
                }`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm select-none">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                  <Badge variant="primary" className="text-[10px] mt-2 uppercase font-bold tracking-wider bg-brand-light text-brand-primary">
                    {p.limit}
                  </Badge>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900">{p.price}</span>
                  <span className="text-sm font-semibold text-slate-500">/ month</span>
                </div>

                <ul className="space-y-4 pt-6 border-t border-slate-100 text-sm text-slate-600 font-medium">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                {p.current ? (
                  <button className="w-full font-bold text-sm bg-slate-100 text-slate-500 px-6 py-3.5 rounded-xl cursor-default flex items-center justify-center">
                    Active Current Plan
                  </button>
                ) : (
                  <BillingPortalActions
                    priceId={p.priceId}
                    label={p.cta}
                    className={`w-full font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center transition-all ${
                      p.popular 
                        ? "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-md" 
                        : "bg-white text-slate-900 border-2 border-slate-100 hover:border-brand-primary hover:text-brand-primary"
                    }`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </MotionItem>
    </MotionContainer>
  );
}
