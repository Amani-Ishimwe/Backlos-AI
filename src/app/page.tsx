"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const plans = [
    {
      name: "Starter Plan",
      price: "$49",
      desc: "Perfect for single hackathons and standard grant registries looking to start anti-ghosting pipelines.",
      features: [
        "Up to 200 applicants / month",
        "Standard AI feedback reviews",
        "CSV Ingest & manual entries",
        "Resend email dispatch system",
        "Public Accountability portal",
        "No long-term commitments",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Growth Plan",
      price: "$199",
      desc: "Ideal for high-velocity accelerators, fellowships, and competitive job registry portals.",
      features: [
        "Up to 2,000 applicants / month",
        "Premium AI feedback engine",
        "Priority parallel compilation runs",
        "White-labeled applicant portals",
        "Priority email dispatches & audits",
        "Anti-Ghosting daily reminders",
      ],
      cta: "Deploy Growth Plan",
      popular: true,
    },
    {
      name: "Scale Plan",
      price: "$599",
      desc: "Built for massive enterprise fellowships, universities, and large-scale government grant portals.",
      features: [
        "Up to 10,000 applicants / month",
        "Advanced deep-personalized models",
        "SLA guaranteed dispatches",
        "Dedicated database clusters",
        "Anti-Ghosting automated escalation",
        "24/7 Priority support hotline",
      ],
      cta: "Contact Enterprise",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "How does the AI ensure highly constructive feedback?",
      a: "Our Feedback Engine parses score percentiles and raw judge comments against your defined rubric. It highlights precise strengths, target focus areas, and outlines clear actionable steps to ensure candidates learn and improve.",
    },
    {
      q: "Can we integrate Backlos with existing applicant trackers?",
      a: "Yes! Backlos works with CSV/Excel sheets exported from standard tools like Typeform, Google Forms, Greenhouse, and Notion, and integrates directly via secure developer APIs.",
    },
    {
      q: "Is candidate email delivery secure?",
      a: "Absolutely. We route transactional template dispatches through premium Resend SMTP servers, ensuring high inbox deliverability rates and full brand consistency.",
    },
    {
      q: "How do sandboxed developer redirects work?",
      a: "During development or test modes, all outbound applicant emails are securely routed to Resend test inboxes. This protects real candidate inboxes from receiving accidental drafts.",
    },
    {
      q: "What is the anti-ghosting deadline alarm?",
      a: "It is an automated background cron daemon that checks program deadlines and sends slack/email notifications to coordinators before candidates feel neglected.",
    },
  ];

  const testimonials = [
    {
      quote: "We managed a global hackathon with over 500 developers. Previously, sending customized feedback took us a month. With Backlos, we generated and bulk dispatched personalized reports within 5 minutes. The developers loved learning exactly why they missed out!",
      author: "Jean Dev",
      role: "Fellowship Director",
    },
    {
      quote: "Candidate ghosting was hurting our talent acquisition metrics. Backlos spreadsheet workspace makes it trivial to drop csv files, run on-the-fly syntax checks, and schedule anti-ghosting alarms. 100% recommended for high-velocity teams.",
      author: "Marie Noel",
      role: "HR Operations Manager",
    },
    {
      quote: "As a participant, getting comprehensive evaluations on my submission was extremely refreshing. Instead of a standard cold rejection email, I received detailed improvement Areas and actionable next steps. It kept me highly engaged!",
      author: "David K.",
      role: "Hackathon Applicant",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-slate-800 font-sans antialiased">
      
      {/* 1. Transparent Header (Navbar) */}
      <div className="w-full bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <header className="max-w-6xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="flex items-center justify-center w-7 h-7 bg-brand-primary text-white rounded-lg shadow-sm select-none">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M16 3h5v5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 21H3v-5" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Backlos
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <a href="#product" className="hover:text-brand-primary transition-colors">Product</a>
            <a href="#reviews" className="hover:text-brand-primary transition-colors">Reviews</a>
            <a href="#benefits" className="hover:text-brand-primary transition-colors">Benefits</a>
            <a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm" className="bg-brand-primary border-0 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-btn shadow-sm hover:opacity-95 transition-opacity">
                Get Started
              </Button>
            </Link>
          </div>
        </header>
      </div>

      {/* 2. Hero Section */}
      <section id="product" className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-badge text-brand-primary text-xs font-bold uppercase tracking-wider select-none">
          <svg className="w-3.5 h-3.5 text-brand-primary animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
          </svg>
          <span>55,000+ candidate closures processed</span>
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-4xl mx-auto">
          Put An End to Candidate Ghosting.
        </h1>
        
        <p className="text-base sm:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
          Maximize your cohort's reputation index with Backlos, the AI-powered feedback delivery engine that auto-compiles and bulk dispatches structured feedback to every applicant automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-4 bg-brand-primary border-0 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-all">
              Start Free
            </Button>
          </Link>
          <a href="#benefits" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border-slate-200 transition-all font-bold text-xs uppercase tracking-wider text-slate-700">
              More Info
            </Button>
          </a>
        </div>
        
        <p className="text-[10px] text-slate-400 font-bold italic tracking-wide">
          *No credit card required, start free instantly.*
        </p>
      </section>

      {/* 3. The Clover Advantages Section */}
      <section id="benefits" className="bg-white border-y border-slate-100 py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest block select-none">
              THE CLOVER ADVANTAGES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Maximize Your Candidate Brand with Smart Automation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 hover:bg-slate-50 rounded-btn transition-colors duration-200">
              <div className="w-10 h-10 bg-indigo-50 text-brand-primary flex items-center justify-center rounded-xl border border-indigo-100 select-none">
                <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="3" />
                  <line x1="15" y1="1" x2="15" y2="3" />
                  <line x1="9" y1="21" x2="9" y2="23" />
                  <line x1="15" y1="21" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="15" x2="23" y2="15" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="15" x2="4" y2="15" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900">AI-Optimized Feedback – No Effort Required</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Leverage advanced generative models to automatically synthesize scores and evaluator notes, ensuring every rejected applicant receives deep-personalized evaluations.
              </p>
            </div>

            <div className="space-y-4 p-6 hover:bg-slate-50 rounded-btn transition-colors duration-200">
              <div className="w-10 h-10 bg-indigo-50 text-brand-primary flex items-center justify-center rounded-xl border border-indigo-100 select-none">
                <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900">Real-Time Insights – Smarter Coaching</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Never keep applicants wondering where they stand. Track generation queues with live status indicators and glow progress metrics in real-time.
              </p>
            </div>

            <div className="space-y-4 p-6 hover:bg-slate-50 rounded-btn transition-colors duration-200">
              <div className="w-10 h-10 bg-indigo-50 text-brand-primary flex items-center justify-center rounded-xl border border-indigo-100 select-none">
                <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="2" y1="14" x2="6" y2="14" />
                  <line x1="10" y1="8" x2="14" y2="8" />
                  <line x1="18" y1="16" x2="22" y2="16" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900">Flexible Rubrics – Tailored for You</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Define custom evaluation criteria parameters and weight balances (Design, Dev, Pitch) that perfectly suit your program cohort's unique goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Benefits Grid Section */}
      <section className="py-24 max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest block select-none">
            BENEFITS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Why We Shine?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Instant Compilations</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Generate personalized reviews in seconds. Powered by 8x parallel worker queues to process massive applicant volumes effortlessly.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-50 mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
              <span>Parallel Processing</span>
              <span className="text-brand-primary">Active</span>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Real-Time Ingestion</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Ingest evaluation spreadsheets or enter metrics cell-by-cell in our in-browser data grid. Built-in header checkers validate schema instantly.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-50 mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
              <span>CSV & Excel Grid</span>
              <span className="text-brand-primary">Active</span>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Flexible Rubrics</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Establish custom criteria scales that grow with your accelerator. Adjust rubric weights seamlessly to align with new intake specs.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-50 mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
              <span>Adaptive Rubrics</span>
              <span className="text-brand-primary">Active</span>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Secure Sandboxed Relays</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Protect real applicant inboxes during drafts. In development mode, every outbound template is securely redirected to a Resend test sandbox.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-50 mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
              <span>Sandbox Relayers</span>
              <span className="text-brand-primary">Active</span>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Adaptive Reminders</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Automated Inngest background cron routines check program dates, notifying managers to publish score reviews before cohorts feel abandoned.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-50 mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
              <span>Anti-Ghosting Shield</span>
              <span className="text-brand-primary">Active</span>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Dedicated Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Access personalized setup advice and API documentation anytime from our operations team to help you optimize candidate experiences.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-50 mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
              <span>Dedicated Support</span>
              <span className="text-brand-primary">Active</span>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Process Section */}
      <section className="bg-white border-y border-slate-100 py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest block select-none">
              PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Our Simple Four-Step Approach
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative select-none">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-brand-primary flex items-center justify-center font-extrabold text-lg rounded-xl border border-indigo-100 shadow-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Simplified Onboarding</h3>
              <ul className="text-xs text-slate-500 space-y-2 leading-relaxed font-medium list-disc pl-4">
                <li>Configure your evaluation rubric in seconds.</li>
                <li>Define metrics and weights summing to 100%.</li>
                <li>Download clean ready-to-use CSV templates.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-brand-primary flex items-center justify-center font-extrabold text-lg rounded-xl border border-indigo-100 shadow-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">AI-Powered Ingest</h3>
              <ul className="text-xs text-slate-500 space-y-2 leading-relaxed font-medium list-disc pl-4">
                <li>Type candidate metrics directly in the grid.</li>
                <li>Upload custom CSV/Excel sheets.</li>
                <li>Dynamic header validations check score ranges.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-brand-primary flex items-center justify-center font-extrabold text-lg rounded-xl border border-indigo-100 shadow-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Personalized Audit</h3>
              <ul className="text-xs text-slate-500 space-y-2 leading-relaxed font-medium list-disc pl-4">
                <li>Launch parallel compilation pools.</li>
                <li>Verify report previews in your room.</li>
                <li>Individually regenerate outliers with single clicks.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-brand-primary flex items-center justify-center font-extrabold text-lg rounded-xl border border-indigo-100 shadow-sm">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900">Transparent Dispatches</h3>
              <ul className="text-xs text-slate-500 space-y-2 leading-relaxed font-medium list-disc pl-4">
                <li>Approve and send bulk feedback emails.</li>
                <li>Safe sandbox shields prevent leakages.</li>
                <li>Track open dispatches via Resend logs.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Product Reviews Masonry Section */}
      <section id="reviews" className="py-24 max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest block select-none">
            REVIEWS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            What Our Valued Program Managers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="p-6 border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-50 mt-4">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-brand-primary border border-indigo-100 flex items-center justify-center font-extrabold text-xs select-none uppercase">
                  {t.author.slice(0, 2)}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 capitalize">{t.author}</span>
                  <span className="text-[10px] text-slate-400 truncate">{t.role}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. SaaS Pricing Grid Section */}
      <section id="pricing" className="bg-white border-y border-slate-100 py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest block select-none">
              PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Choose the Perfect Plan
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              We offer flexible pricing plans that align with where your business stands today and where it's headed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <Card
                key={p.name}
                className={`p-8 border-1.5 flex flex-col justify-between relative bg-white transition-all
                  ${p.popular ? "border-brand-primary shadow-xl ring-2 ring-brand-primary ring-opacity-50" : "border-slate-200 shadow-sm"}`}
              >
                {p.popular && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-indigo-50 border border-indigo-100 text-brand-primary text-[10px] font-bold uppercase tracking-wider rounded-badge">
                    Most Popular
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-normal font-medium">{p.desc}</p>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">{p.price}</span>
                    <span className="text-xs font-semibold text-slate-400">/ month</span>
                  </div>

                  <ul className="space-y-3.5 pt-6 border-t border-slate-100 text-xs text-slate-700 font-semibold">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-3.5 h-3.5 text-emerald-500 inline-block mr-2.5 select-none mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link href="/signup" className="w-full">
                    <Button variant={p.popular ? "primary" : "outline"} className={`w-full font-bold shadow-sm ${p.popular ? "bg-brand-primary border-0 text-white hover:opacity-95" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                      {p.cta}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold text-slate-400 tracking-wider uppercase pt-6 select-none">
            <span className="flex items-center">
              <svg className="w-4 h-4 text-slate-400 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              100% Safe Purchase
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 text-slate-400 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              7-Day Money Back Guarantee
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 text-slate-400 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" />
                <path d="M12 9c2-2 5-2 7-2 0 2 0 5-2 7l-9 9H3v-5z" />
                <path d="M9 15l3-3" />
                <path d="M17 3s3 1 3 3-1 3-3 3" />
              </svg>
              Delivery In &lt;24h
            </span>
          </div>
        </div>
      </section>

      {/* 8. Competitor Comparison Section */}
      <section className="py-24 max-w-4xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest block select-none">
            COMPARISON
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Our Value vs. Competitor Value
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            Compare our SaaS to standard applicant tracking tools and discover how we protect brand credibility, eliminate ghosting, and offer greater feedback flexibility.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-btn overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs bg-white">
            <thead className="bg-slate-50 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-4">Features</th>
                <th className="px-6 py-4 text-brand-primary font-extrabold">Backlos AI Engine</th>
                <th className="px-6 py-4">Standard ATS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              <tr>
                <td className="px-6 py-4">AI-Powered Personalized Feedback</td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">Real-Time Ingestion Grids</td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">Customer Support</td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">No Hidden Fees</td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">Anti-Ghosting Safeguards</td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">Integrations via CSV/Excel</td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </td>
                <td className="px-6 py-4">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. FAQs Section */}
      <section className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-3xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest block select-none">
              FAQ'S
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Got a quick question?
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              We're here to help you make the right decision. Explore our frequently asked questions and find answers below.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleFaq(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFaq(idx);
                    }
                  }}
                  className={`bg-slate-50 border rounded-btn p-5 transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-primary
                    ${isOpen ? "border-brand-primary bg-indigo-50/20" : "border-slate-200 hover:border-slate-300 hover:bg-slate-100/50"}`}
                >
                  <div className="w-full flex items-center justify-between font-bold text-slate-800 text-xs uppercase tracking-wider text-left">
                    <span>{faq.q}</span>
                    <span className={`text-base font-bold transition-transform duration-200 pl-4 ${isOpen ? "text-brand-primary rotate-180" : "text-slate-400"}`}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                  {isOpen && (
                    <p className="text-xs text-slate-500 leading-relaxed font-medium pt-3 mt-3 border-t border-indigo-100 animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Call to Action Banner Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="relative rounded-2xl overflow-hidden p-12 bg-white border border-slate-200 text-center space-y-6 shadow-xl select-none">
          <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest block select-none">
            KEY TAKEAWAYS
          </span>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Start Delivering Candidate Closure and Protecting Your Brand Today.
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
            Experience the power of automated, constructive review loops. Get started now to boost program trust indexes and candidate retention scales.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-brand-primary hover:opacity-95 text-white border-0 font-bold text-xs uppercase tracking-wider px-8 py-4 shadow-md">
                Get Started
              </Button>
            </Link>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider p-2">
              Not sure if we're a fit?
            </div>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider px-8 py-4 shadow-sm">
                Schedule A Call
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Footer Section */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between text-xs text-slate-400 space-y-4 md:space-y-0 select-none font-semibold">
        <div className="flex items-center space-x-2.5">
          <span className="flex items-center justify-center w-6 h-6 bg-brand-primary text-white rounded-lg shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M16 3h5v5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 21H3v-5" />
            </svg>
          </span>
          <span className="font-bold text-slate-900">Backlos Clover</span>
          <span>&middot; Maximize Your Candidate Brand Potential</span>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link>
          <a href="mailto:support@backlos.app" className="hover:text-brand-primary transition-colors">Contact Support</a>
        </div>

        <div className="text-[10px]">
          <span>© 2024 Clover Template &bull; Made by Framebase &bull; Rwanda &bull; 2026</span>
        </div>
      </footer>

    </div>
  );
}
