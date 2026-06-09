"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function RedesignedLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"organizers" | "subscriptions" | "developers">("organizers");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const advantages = [
    {
      title: "AI-Optimized Reviews",
      desc: "Never miss a review cycle. Our feedback engine dynamically parses judge notes and rubrics to write constructive reports instantly.",
      icon: (
        <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      title: "Real-Time Deliverability",
      desc: "Get 100% inbox delivery rate. Every dispatch is routed through dedicated Resend domains with open tracking and sandbox testing options.",
      icon: (
        <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.25 0l-2.25 1.5" />
        </svg>
      ),
    },
    {
      title: "White-labeled Portals",
      desc: "Give candidates a premium experience. Enable custom subdomains, rubrics, and brand badges matching your organization's theme.",
      icon: (
        <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
  ];

  const benefits = [
    {
      title: "Real-Time Ingestion",
      desc: "Connect forms (Typeform, Google Forms) or ATS via secure webhook callbacks.",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      title: "AI-Powered Audit",
      desc: "Deep analysis of applicant profiles against custom rubrics for absolute fairness.",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: "Transparent Dispatches",
      desc: "Every email sent is logged and tracked with open rates and click analytics.",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      title: "Customizable Rubrics",
      desc: "Define what matters most. Tailor grading scales and weights to your cohort.",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      title: "Simplified Onboarding",
      desc: "Get started in minutes with direct CSV imports and intuitive column mapping.",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </svg>
      ),
    },
    {
      title: "Dedicated Support",
      desc: "24/7 priority assistance to ensure your programs and integrations run smoothly.",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Integrate Program",
      desc: "Connect your intake form, upload a CSV spreadsheet, or link ATS API webhooks in seconds.",
    },
    {
      number: "02",
      title: "Define Rubric",
      desc: "Establish scores, customize grading criteria, and adjust the specific tone of voice.",
    },
    {
      number: "03",
      title: "Run AI Auditing",
      desc: "Parallel worker queues automatically scan candidate data and generate personalized constructive reports.",
    },
    {
      number: "04",
      title: "Auto-Dispatch",
      desc: "Securely send white-labeled, personalized HTML review emails directly to your cohort via Resend.",
    },
  ];

  const pricingTabs = {
    organizers: {
      subtitle: "Perfect for hackathons, seasonal grants, and one-off application events.",
      cards: [
        {
          name: "Micro Event",
          price: "$49",
          period: "event",
          desc: "Perfect for local cohorts, smaller grant applications, and test runs.",
          features: [
            "Up to 100 applicants",
            "Standard Applicant Dashboard",
            "Email Delivery",
            "Ghost-Fighting Workflows",
          ],
          cta: "Purchase Pass",
          popular: false,
        },
        {
          name: "Standard Event",
          price: "$149",
          period: "event",
          desc: "Most popular choice for medium-sized hackathons and standard programs.",
          features: [
            "Up to 500 applicants",
            "Standard Applicant Dashboard",
            "Email Delivery",
            "Ghost-Fighting Workflows",
            "Analytics post-event",
          ],
          cta: "Purchase Pass",
          popular: true,
        },
        {
          name: "Mega Hackathon",
          price: "$299",
          period: "event",
          desc: "For large hackathons and national cohorts with high throughput.",
          features: [
            "Up to 1,500 applicants",
            "Standard Applicant Dashboard",
            "Email Delivery",
            "Ghost-Fighting Workflows",
            "$0.20 per overage",
            "Premium Support",
          ],
          cta: "Purchase Pass",
          popular: false,
        },
      ],
    },
    subscriptions: {
      subtitle: "Continuous feedback infrastructure for hiring teams and university admissions.",
      cards: [
        {
          name: "Starter",
          price: "$79",
          period: "mo",
          desc: "Great for early stage projects and continuous small recruitment cycles.",
          features: [
            "Up to 250 reports/mo",
            "Standard Integrations (ATS, Webhooks)",
            "Branded Dashboard",
            "Standard Support",
          ],
          cta: "Start Building",
          popular: false,
        },
        {
          name: "Growth",
          price: "$249",
          period: "mo",
          desc: "Perfect for growing hiring teams needing custom domains and rubrics.",
          features: [
            "Up to 1,000 reports/mo",
            "Standard Integrations (ATS, Webhooks)",
            "Branded Dashboard",
            "Advanced Rubric Intelligence",
            "Connected Domain (Resend)",
            "Priority Support",
          ],
          cta: "Start Building",
          popular: true,
        },
        {
          name: "Scale",
          price: "$699",
          period: "mo",
          desc: "For enterprise scale cohorts requiring real-time logs and account managers.",
          features: [
            "Up to 5,000 reports/mo",
            "Standard Integrations (ATS, Webhooks)",
            "Branded Dashboard",
            "Real-time Analytics Dashboard",
            "Dedicated Account Manager",
            "SLA Guarantees",
          ],
          cta: "Start Building",
          popular: false,
        },
      ],
    },
    developers: {
      subtitle: "Headless feedback generation embedded directly into your own platform.",
      cards: [
        {
          name: "Sandbox",
          price: "Free",
          period: null,
          desc: "Test your API integration and customize JSON schema models for free.",
          features: [
            "Unlimited test environments",
            "Direct API Access",
            "Basic Rate Limits",
            "Community Support",
          ],
          cta: "Start Building",
          popular: false,
        },
        {
          name: "Production",
          price: "$0.15",
          period: "report",
          desc: "Pay strictly as you scale feedback dispatches, with custom JSON schemas.",
          features: [
            "Pay only for successful generations",
            "Custom Schemas",
            "Bring Your Own Delivery",
            "Direct Webhooks Integration",
          ],
          cta: "Start Building",
          popular: true,
        },
        {
          name: "High Volume",
          price: "$0.08",
          period: "report",
          desc: "Lower rate bracket automatically applied for high throughput platforms.",
          features: [
            "Automatically applied at >10k requests/mo",
            "Custom Schemas",
            "Bring Your Own Delivery",
            "SLA Guarantees",
          ],
          cta: "Start Building",
          popular: false,
        },
      ],
    },
  };

  const faqs = [
    {
      q: "How does the AI ensure constructive feedback?",
      a: "Our Feedback Engine parses score percentiles and raw judge comments against your defined rubric. It highlights precise strengths, target focus areas, and outlines clear actionable steps to ensure candidates learn and improve.",
    },
    {
      q: "Can I integrate Backlos with existing tools?",
      a: "Yes! Backlos works with CSV/Excel sheets exported from standard tools like Typeform, Google Forms, Greenhouse, and Notion, and integrates directly via secure developer APIs and webhooks.",
    },
    {
      q: "Is candidate email delivery secure?",
      a: "Absolutely. We route transactional template dispatches through premium Resend SMTP servers, ensuring high inbox deliverability rates and full brand consistency.",
    },
    {
      q: "What is the anti-ghosting deadline alarm?",
      a: "It is an automated background cron daemon that checks program deadlines and sends slack/email notifications to coordinators before candidates feel neglected.",
    },
    {
      q: "Can I try Backlos before purchasing?",
      a: "Yes, you can register and run sandboxed reviews with test applicant records for free to preview output reports before purchasing a paid plan.",
    },
  ];

  const testimonials = [
    {
      quote: "We managed a global hackathon with over 500 developers. With Backlos, we generated and bulk dispatched personalized reports within 5 minutes. The developers loved it!",
      author: "Jean Dev",
      role: "Fellowship Director",
    },
    {
      quote: "Candidate ghosting was hurting our talent acquisition metrics. Backlos spreadsheet workspace makes it trivial to schedule anti-ghosting alarms. 100% recommended.",
      author: "Marie Noel",
      role: "HR Operations Manager",
    },
    {
      quote: "Instead of a standard cold rejection email, I received detailed improvement areas and actionable next steps. It kept me highly engaged!",
      author: "David K.",
      role: "Hackathon Applicant",
    },
    {
      quote: "A game-changer for accelerator applications. Candidates who didn't get accepted still praised our process because of the valuable feedback.",
      author: "Sarah L.",
      role: "Venture Lead",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-brand-text font-sans antialiased selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* Background blobs for premium depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[1200px] right-0 w-[500px] h-[500px] bg-[#938EFF]/5 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Navbar */}
      <div className="fixed top-0 w-full z-50 flex flex-col items-center mt-4 px-4 pointer-events-none">
        <header className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-brand-border/40 rounded-full h-14 px-6 flex items-center justify-between w-full max-w-5xl shadow-[0_4px_30px_rgba(108,99,255,0.03)]">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-8 h-8 bg-brand-primary text-white rounded-full shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M16 3h5v5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 21H3v-5" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight text-brand-text">
              Backlos
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-[13px] font-semibold text-brand-muted">
            <a href="#features" className="hover:text-brand-primary transition-colors">Product</a>
            <a href="#benefits" className="hover:text-brand-primary transition-colors">Benefits</a>
            <a href="#reviews" className="hover:text-brand-primary transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-brand-primary transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login" className="hidden sm:block">
              <button className="text-[13px] font-semibold text-brand-muted hover:text-brand-text transition-colors px-3 py-2">
                Log in
              </button>
            </Link>
            <Link href="/signup" className="hidden sm:block">
              <button className="bg-brand-text hover:bg-slate-800 text-white font-semibold text-[13px] px-5 py-2 rounded-full shadow-sm transition-all duration-200 hover:scale-105 active:scale-95">
                Get Started
              </button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-brand-light text-brand-muted hover:text-brand-primary md:hidden transition-colors flex items-center justify-center pointer-events-auto"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </header>
 
        {/* Mobile Menu Dropdown Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto mt-2 w-full max-w-5xl bg-white/95 backdrop-blur-xl border border-brand-border/40 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(108,99,255,0.08)] md:hidden flex flex-col space-y-4"
            >
              <nav className="flex flex-col space-y-2 font-semibold text-[14px] text-brand-muted">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 hover:bg-brand-light hover:text-brand-primary rounded-xl transition-all"
                >
                  Product
                </a>
                <a
                  href="#benefits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 hover:bg-brand-light hover:text-brand-primary rounded-xl transition-all"
                >
                  Benefits
                </a>
                <a
                  href="#reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 hover:bg-brand-light hover:text-brand-primary rounded-xl transition-all"
                >
                  Reviews
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 hover:bg-brand-light hover:text-brand-primary rounded-xl transition-all"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 hover:bg-brand-light hover:text-brand-primary rounded-xl transition-all"
                >
                  FAQ
                </a>
              </nav>
 
              <div className="h-px bg-slate-100 w-full" />
 
              <div className="flex flex-col space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-slate-50 hover:bg-slate-100 text-brand-text font-bold text-sm py-2.5 rounded-xl border border-slate-200 transition-colors">
                    Log in
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm py-2.5 rounded-xl shadow-[0_4px_12px_rgba(108,99,255,0.2)] text-center transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center z-10">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-brand-light/60 border border-brand-border/30 px-4 py-1.5 rounded-full text-brand-primary text-[13px] font-medium shadow-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
            <span>Over 55,000 candidate closures processed</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-brand-text leading-[1.05] mb-6">
            Put An End to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#938EFF]">Candidate Ghosting.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed font-medium mb-10">
            Maximize your cohort's reputation index with Backlos, the AI-powered feedback delivery engine that auto-compiles and bulk dispatches structured feedback to every applicant automatically.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="bg-brand-primary hover:bg-brand-primary/95 text-white font-semibold text-base px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(108,99,255,0.25)] transition-all duration-200 hover:-translate-y-1 w-full flex items-center justify-center">
                Start for free
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </Link>
            <a href="#benefits" className="w-full sm:w-auto">
              <button className="bg-white border border-brand-border/40 hover:border-brand-border text-brand-text font-semibold text-base px-8 py-4 rounded-full shadow-sm transition-all duration-200 hover:-translate-y-1 w-full">
                See how it works
              </button>
            </a>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-semibold text-brand-muted">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              *No long-term commitment, cancel anytime.*
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              *Instant reviews first, monthly updates on the 1st.*
            </span>
          </motion.div>

        </motion.div>

        {/* Dashboard Mockup Representation */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 w-full max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl md:rounded-[2rem] border border-brand-border/40 bg-white/50 backdrop-blur-xl p-2 md:p-4 shadow-[0_20px_50px_rgba(108,99,255,0.06)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
            <div className="w-full aspect-[16/10] md:aspect-[16/9] bg-slate-50 rounded-xl md:rounded-2xl border border-brand-border/20 flex flex-col overflow-hidden text-left font-sans">
              {/* Mock Topbar */}
              <div className="h-12 border-b border-brand-border/20 bg-white flex items-center px-4 justify-between">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex items-center space-x-1 bg-slate-100 rounded-md px-3 py-1 text-[11px] font-semibold text-brand-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Console: Backlos Workspace</span>
                </div>
                <div className="w-12"></div>
              </div>
              
              {/* Mock Application Container */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-48 border-r border-brand-border/10 bg-white p-4 hidden md:flex flex-col space-y-2">
                  <div className="text-[11px] font-bold text-brand-muted tracking-wider uppercase mb-2">Backlos SaaS</div>
                  <div className="h-8 rounded-lg bg-brand-light flex items-center px-3 text-xs font-bold text-brand-primary">Applicants</div>
                  <div className="h-8 rounded-lg hover:bg-slate-50 flex items-center px-3 text-xs font-medium text-brand-muted transition-all">Rubrics Customizer</div>
                  <div className="h-8 rounded-lg hover:bg-slate-50 flex items-center px-3 text-xs font-medium text-brand-muted transition-all">Resend Relay</div>
                  <div className="h-8 rounded-lg hover:bg-slate-50 flex items-center px-3 text-xs font-medium text-brand-muted transition-all">Quota Billing</div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 overflow-y-auto">
                  {/* Candidates List Column */}
                  <div className="flex-1 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-brand-text">Cohort Applicants</h4>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">124 Accepted</span>
                    </div>

                    <div className="border border-brand-border/20 rounded-xl bg-white shadow-sm overflow-hidden text-xs">
                      {[
                        { name: "Alex Mercer", score: "89/100", status: "Review Complete", color: "bg-brand-light text-brand-primary" },
                        { name: "Samantha Li", score: "94/100", status: "Dispatched", color: "bg-emerald-100 text-emerald-800" },
                        { name: "Jordan Brooks", score: "72/100", status: "Ready to Send", color: "bg-amber-100 text-amber-800" }
                      ].map((cand, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border-b border-brand-border/10 hover:bg-slate-50 transition-all">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-brand-text">{cand.name.charAt(0)}</div>
                            <span className="font-semibold text-brand-text">{cand.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-brand-muted">{cand.score}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${cand.color}`}>{cand.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gemini Feedback Preview Panel */}
                  <div className="w-full md:w-80 border border-brand-border/20 bg-white rounded-xl shadow-sm p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-3">
                        <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                        <h4 className="text-xs font-bold text-brand-text">Live feedback draft</h4>
                      </div>
                      <div className="border border-brand-border/10 rounded-lg p-3 bg-brand-light/35 font-mono text-[10px] text-brand-text space-y-2 leading-relaxed">
                        <p className="font-bold text-brand-primary">TO: alex.mercer@gmail.com</p>
                        <p className="text-brand-muted">"Dear Alex, thank you for applying to the fellowship. Your project demonstrated excellent architecture, but the database connection lacked failovers..."</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-brand-light flex items-center justify-between">
                      <span className="text-[10px] text-brand-muted font-semibold">Gemini 1.5 Flash Model</span>
                      <button className="bg-brand-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-btn hover:bg-brand-primary/95 transition-all">Send Report</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 2: Advantages */}
      <section id="features" className="py-24 px-6 bg-slate-50/50 border-y border-brand-border/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="bg-brand-light text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              THE BACKLOS ADVANTAGES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-text">
              Why Choose Us ?
            </h2>
            <p className="text-lg text-brand-muted max-w-2xl mx-auto font-medium">
              Leverage parallel worker queues and advanced Gemini AI model fine-tuning to automate candidate closure without losing the human touch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {advantages.map((adv, idx) => (
              <div
                key={idx}
                className="bg-white border border-brand-border/30 hover:border-brand-primary/40 rounded-card p-8 shadow-premium hover:shadow-[0_12px_30px_rgba(108,99,255,0.06)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 bg-brand-light/70 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-brand-primary group-hover:scale-110 transition-transform">
                    {adv.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand-text mb-4">{adv.title}</h3>
                  <p className="text-brand-muted font-medium text-sm leading-relaxed">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Running badges pill cloud */}
          <div className="flex flex-wrap justify-center items-center gap-3 max-w-3xl mx-auto">
            {["Automatic Adjustments", "Real-Time Reports", "Secure Transactions", "Dedicated Support", "Instant Feedback", "Flexible Rubrics"].map((badge, idx) => (
              <span
                key={idx}
                className="bg-white border border-brand-border/20 text-brand-text text-xs font-semibold px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5 hover:border-brand-primary/30 transition-all"
              >
                <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Benefits */}
      <section id="benefits" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-brand-light text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            BENEFITS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-text">
            Why We Shine ?
          </h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto font-medium">
            Discover how Backlos streamlines the review cycle and protects candidate goodwill.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-card bg-white hover:bg-slate-50/50 transition-all duration-300 border border-brand-border/25 flex flex-col items-start text-left hover:border-brand-primary/30"
            >
              <div className="w-12 h-12 bg-brand-light/75 rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-sm border border-brand-border/10">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-text mb-3">{feature.title}</h3>
              <p className="text-brand-muted font-medium text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Process */}
      <section id="process" className="py-24 px-6 bg-slate-50/30 border-y border-brand-border/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="bg-brand-light text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              PROCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-text">
              Our Approach
            </h2>
            <p className="text-lg text-brand-muted max-w-2xl mx-auto font-medium">
              Our streamlined process ensures quick, efficient results, from setup to dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div key={idx} className="bg-white border border-brand-border/20 rounded-card p-6 shadow-sm flex flex-col justify-between hover:border-brand-primary/30 transition-all duration-200">
                <div>
                  <div className="text-3xl font-extrabold text-brand-primary/20 mb-4">{st.number}</div>
                  <h3 className="text-base font-bold text-brand-text mb-2">{st.title}</h3>
                  <p className="text-brand-muted text-xs font-medium leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Product Showcases */}
      <section id="product-showcase" className="py-24 px-6 max-w-6xl mx-auto space-y-32">
        {/* Showcase 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <span className="text-brand-primary text-xs font-bold uppercase tracking-wider">PRODUCT SHOWCASE</span>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text leading-tight">
              AI-Driven Feedback Reports
            </h3>
            <p className="text-brand-muted font-medium leading-relaxed">
              Save more time on every cohort with AI-powered optimization. Backlos parses judges' score sheets to write highly detailed reviews that guide applicant learning automatically.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full">Get Started</Button>
            </Link>
          </div>
          <div className="flex-1 w-full bg-slate-50 border border-brand-border/20 rounded-card p-6 shadow-sm flex flex-col space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-brand-border/10">
              <span className="w-3 h-3 rounded-full bg-brand-primary"></span>
              <span className="text-xs font-bold text-brand-text">Constructive Feedback Engine</span>
            </div>
            <div className="bg-white border border-brand-border/10 rounded-xl p-4 text-xs font-medium text-brand-text space-y-3">
              <div className="flex justify-between items-center bg-brand-light/30 p-2 rounded-lg text-brand-primary font-bold">
                <span>Subject: Rubric Performance Review</span>
                <span>Gemini API Output</span>
              </div>
              <p className="text-brand-muted leading-relaxed">
                "We loved your presentation. However, the data synchronization model relies on polling rather than socket streams. In production, this will cause server stress. We suggest migrating to Socket.io."
              </p>
            </div>
          </div>
        </div>

        {/* Showcase 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 space-y-6">
            <span className="text-brand-primary text-xs font-bold uppercase tracking-wider">REAL-TIME REPORTS</span>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text leading-tight">
              Detailed Deliverability Insights
            </h3>
            <p className="text-brand-muted font-medium leading-relaxed">
              Track candidate email analytics in real-time. Know exactly who has opened their review, who click-through to view their grades, and maintain complete deliverability logs.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full">Get Started</Button>
            </Link>
          </div>
          <div className="flex-1 w-full bg-slate-50 border border-brand-border/20 rounded-card p-6 shadow-sm flex flex-col space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-brand-border/10">
              <span className="w-3 h-3 rounded-full bg-brand-primary"></span>
              <span className="text-xs font-bold text-brand-text">Deliverability Log Console</span>
            </div>
            <div className="bg-white border border-brand-border/10 rounded-xl p-4 text-xs space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-lg border border-brand-border/10">
                  <div className="text-lg font-bold text-brand-primary">99.8%</div>
                  <div className="text-[10px] text-brand-muted font-bold">Delivery Rate</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-brand-border/10">
                  <div className="text-lg font-bold text-brand-primary">82.4%</div>
                  <div className="text-[10px] text-brand-muted font-bold">Open Rate</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-brand-border/10">
                  <div className="text-lg font-bold text-brand-primary">64.1%</div>
                  <div className="text-[10px] text-brand-muted font-bold">Click Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Comparison */}
      <section id="comparison" className="py-24 px-6 bg-slate-50/40 border-y border-brand-border/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="bg-brand-light text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              COMPARISON
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text">
              Our Value vs. Traditional Rejections
            </h2>
            <p className="text-base text-brand-muted font-medium">
              Compare Backlos to standard email templates and discover how personalization enhances your brand equity.
            </p>
          </div>

          <div className="border border-brand-border/30 rounded-card overflow-hidden bg-white shadow-premium">
            <div className="grid grid-cols-3 bg-brand-light/40 border-b border-brand-border/20 p-4 font-bold text-sm text-brand-text">
              <div>Feature</div>
              <div className="text-brand-primary">Backlos platform</div>
              <div className="text-brand-muted">Traditional Email</div>
            </div>
            {[
              { f: "Personalized Content", ours: true, theirs: false },
              { f: "Rubric Performance Scale", ours: true, theirs: false },
              { f: "Actionable Guidance Areas", ours: true, theirs: false },
              { f: "White-labeled Subdomain", ours: true, theirs: false },
              { f: "Automatic Deadline Alarms", ours: true, theirs: false },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 border-b border-brand-border/10 p-4 text-xs font-semibold text-brand-text items-center">
                <div className="text-brand-text">{row.f}</div>
                <div>
                  {row.ours ? (
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-brand-muted">-</span>
                  )}
                </div>
                <div>
                  {row.theirs ? (
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <span className="text-brand-muted">None</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Pricing */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center mb-10 space-y-4">
          <span className="bg-brand-light text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-brand-border/30">
            PRICING
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-text">
            Choose the Perfect Plan
          </h2>
          <p className="text-sm md:text-base text-brand-muted max-w-2xl mx-auto font-medium leading-relaxed">
            {pricingTabs[activeTab].subtitle}
          </p>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="inline-flex bg-brand-light/40 p-1 rounded-full border border-brand-border/30 shadow-sm mb-16 select-none pointer-events-auto">
          {(Object.keys(pricingTabs) as Array<keyof typeof pricingTabs>).map((tabKey) => {
            const labels = {
              organizers: "Event Organizers",
              subscriptions: "SaaS Subscriptions",
              developers: "API Developers",
            };
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                {labels[tabKey]}
              </button>
            );
          })}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full mb-16">
          {pricingTabs[activeTab].cards.map((card) => {
            return (
              <div
                key={card.name}
                className={`relative rounded-[2rem] p-8 md:p-10 flex flex-col bg-white/70 backdrop-blur-md transition-all duration-300
                  ${card.popular
                    ? "border-2 border-brand-primary shadow-[0_20px_40px_rgba(108,99,255,0.06)] md:-translate-y-4 scale-[1.02] z-10"
                    : "border border-brand-border/40 shadow-premium hover:shadow-lg"
                  }`}
              >
                {card.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm select-none">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-brand-text mb-2">{card.name}</h3>
                  <p className="text-xs text-brand-muted font-medium h-12 leading-relaxed">{card.desc}</p>
                </div>

                <div className="mb-8 flex items-baseline text-brand-text">
                  <span className="text-5xl font-extrabold tracking-tight">{card.price}</span>
                  {card.period && (
                    <span className="text-sm text-brand-muted font-semibold ml-2">/{card.period}</span>
                  )}
                </div>

                <Link href="/signup" className="w-full mb-8">
                  <button
                    className={`w-full py-3.5 rounded-full font-bold text-xs transition-all duration-200
                      ${card.popular
                        ? "bg-brand-primary text-white hover:bg-[#5A51E6] shadow-md hover:scale-[1.02] active:scale-95"
                        : "bg-transparent text-brand-primary hover:bg-brand-light border-2 border-brand-primary/20 hover:border-brand-primary hover:scale-[1.02] active:scale-95"
                      }`}
                  >
                    {card.cta}
                  </button>
                </Link>

                <ul className="space-y-4 text-xs font-semibold text-brand-muted flex-grow">
                  {card.features.map((f, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-brand-light flex items-center justify-center mr-3 shrink-0">
                        <svg className="w-2.5 h-2.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 text-center text-[10px] font-semibold text-brand-muted/65">
                  *No long-term commitment – cancel anytime*
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing conversion banner */}
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 p-8 bg-brand-light/30 border border-brand-border/30 rounded-card shadow-sm">
          <div className="flex flex-wrap gap-6 text-xs font-bold text-brand-text justify-center md:justify-start">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              100% Safe Purchase
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              7-Day Money Back Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Instant Setup
            </span>
          </div>
          <div className="text-center md:text-right space-y-2">
            <div className="text-xs font-bold text-brand-text">Not sure if we're a fit?</div>
            <p className="text-[11px] text-brand-muted font-medium">Setup a 15-minute call with our developers.</p>
            <Link href="/contact" className="inline-block mt-2">
              <button className="bg-brand-primary text-white text-[11px] font-bold px-4 py-2 rounded-full hover:bg-brand-primary/90 transition-all shadow-sm">
                Schedule A Call
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 8: Reviews / Testimonials */}
      <section id="reviews" className="py-24 bg-slate-50 border-y border-brand-border/10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center mb-12 space-y-4">
          <span className="bg-brand-light text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            REVIEWS
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-brand-text">Our Valued Clients</h2>
          <p className="text-sm text-brand-muted max-w-lg mx-auto font-medium">Read testimonials from accelerator managers and applicants.</p>
        </div>

        <div className="flex gap-6 px-6 overflow-x-auto pb-8 snap-x hide-scrollbar max-w-7xl mx-auto">
          {testimonials.map((t, idx) => (
            <div key={idx} className="min-w-[320px] md:min-w-[400px] snap-center bg-white p-8 rounded-card border border-brand-border/20 shadow-sm flex flex-col justify-between hover:border-brand-primary/30 transition-all">
              <div className="flex mb-6 text-brand-primary">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-brand-text font-semibold leading-relaxed mb-8">
                "{t.quote}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-primary font-bold text-sm">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs text-brand-text">{t.author}</div>
                  <div className="text-[10px] text-brand-muted font-bold">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9: FAQ Accordion */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-brand-light text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            FAQ'S
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text">
            Frequently asked questions
          </h2>
          <p className="text-sm text-brand-muted font-medium">Explore standard inquiries and learn more about our feedback engine details.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                className={`bg-white border rounded-2xl p-6 cursor-pointer transition-all duration-200
                  ${isOpen ? "border-brand-primary shadow-sm" : "border-brand-border/30 hover:border-brand-primary/30"}`}
              >
                <div className="flex justify-between items-center text-brand-text font-bold text-sm md:text-base">
                  <span>{faq.q}</span>
                  <span className={`transform transition-transform duration-200 flex-shrink-0 ml-4 ${isOpen ? "rotate-45" : "rotate-0"}`}>
                    <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </span>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-brand-muted text-xs md:text-sm font-medium leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-24 px-6 z-10 relative">
        <div className="max-w-5xl mx-auto bg-brand-text rounded-[2rem] md:rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#938EFF]/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Start Automating Feedback and Streamlining Your Cohorts Today.
            </h2>
            <p className="text-sm md:text-base text-slate-300 font-medium max-w-lg">
              Experience the power of automated reviews and optimized candidate communication. Get started now to boost efficiency and maximize cohort reputation index.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full bg-brand-primary hover:bg-[#5A51E6] active:bg-[#493FCF] text-white font-bold text-sm px-8 py-4 rounded-full transition-all">
                  Get Started Now
                </button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-8 py-4 rounded-full transition-all backdrop-blur-sm">
                  Contact Developer
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-6 border-t border-brand-border/20 text-center text-brand-muted text-xs font-semibold z-10 relative bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
             <span className="w-6 h-6 bg-brand-text text-white rounded-md flex items-center justify-center shadow-sm">
               <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M16 3h5v5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 21H3v-5" />
              </svg>
             </span>
             <span className="font-bold text-brand-text text-sm">Backlos</span>
          </div>
          <div className="flex gap-6 text-[11px]">
            <a href="#features" className="hover:text-brand-primary transition-colors">Product</a>
            <a href="#benefits" className="hover:text-brand-primary transition-colors">Benefits</a>
            <a href="#reviews" className="hover:text-brand-primary transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</a>
          </div>
          <div>© {new Date().getFullYear()} Backlos. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
