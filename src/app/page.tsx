"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

// Animation Variants
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

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const plans = [
    {
      name: "Starter",
      price: "$49",
      desc: "Perfect for single hackathons and standard grant registries.",
      features: [
        "Up to 200 applicants / month",
        "Standard AI feedback reviews",
        "CSV Ingest & manual entries",
        "Resend email dispatch system",
        "No long-term commitments",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Growth",
      price: "$199",
      desc: "Ideal for high-velocity accelerators and fellowships.",
      features: [
        "Up to 2,000 applicants / month",
        "Premium AI feedback engine",
        "Priority parallel compilation runs",
        "White-labeled applicant portals",
        "Anti-Ghosting daily reminders",
      ],
      cta: "Deploy Growth Plan",
      popular: true,
    },
    {
      name: "Scale",
      price: "$599",
      desc: "Built for massive enterprise programs and grant portals.",
      features: [
        "Up to 10,000 applicants / month",
        "Advanced deep-personalized models",
        "SLA guaranteed dispatches",
        "Dedicated database clusters",
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
      q: "What is the anti-ghosting deadline alarm?",
      a: "It is an automated background cron daemon that checks program deadlines and sends slack/email notifications to coordinators before candidates feel neglected.",
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
      quote: "Instead of a standard cold rejection email, I received detailed improvement Areas and actionable next steps. It kept me highly engaged!",
      author: "David K.",
      role: "Hackathon Applicant",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased overflow-hidden selection:bg-brand-primary/20 selection:text-brand-primary">
      
      {/* Navbar - Glassmorphism */}
      <div className="fixed top-0 w-full z-50 flex justify-center mt-4 px-4 pointer-events-none">
        <header className="pointer-events-auto bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-full h-14 px-6 flex items-center justify-between w-full max-w-5xl shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-8 h-8 bg-brand-primary text-white rounded-full shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          
          <nav className="hidden md:flex items-center space-x-8 text-[13px] font-semibold text-slate-600">
            <a href="#product" className="hover:text-brand-primary transition-colors">Product</a>
            <a href="#benefits" className="hover:text-brand-primary transition-colors">Benefits</a>
            <a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login" className="hidden sm:block">
              <button className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
                Log in
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[13px] px-5 py-2 rounded-full shadow-sm transition-all duration-200 hover:scale-105 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center">
        {/* Soft Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-white border border-slate-200/80 px-4 py-1.5 rounded-full text-slate-600 text-[13px] font-medium shadow-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary"></span>
            <span>Over 55,000 candidate closures processed</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-slate-900 leading-[1.05] mb-6">
            Put An End to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#938EFF]">Candidate Ghosting.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
            Maximize your cohort's reputation index with Backlos, the AI-powered feedback delivery engine that auto-compiles and bulk dispatches structured feedback to every applicant automatically.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/signup">
              <button className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-base px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(108,99,255,0.25)] transition-all duration-200 hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center">
                Start for free
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </Link>
            <a href="#benefits">
              <button className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-base px-8 py-4 rounded-full shadow-sm transition-all duration-200 hover:-translate-y-1 w-full sm:w-auto">
                See how it works
              </button>
            </a>
          </motion.div>
          
        </motion.div>

        {/* Dashboard Mockup Representation */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 w-full max-w-5xl mx-auto perspective-1000"
        >
          <div className="relative rounded-2xl md:rounded-[2rem] border border-slate-200/60 bg-white/50 backdrop-blur-xl p-2 md:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
            <div className="w-full aspect-[16/9] bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 flex flex-col overflow-hidden">
              {/* Fake Topbar */}
              <div className="h-12 border-b border-slate-200 bg-white flex items-center px-4 space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="ml-4 h-6 w-48 bg-slate-100 rounded-md"></div>
              </div>
              {/* Fake Content */}
              <div className="flex-1 p-6 flex gap-6">
                {/* Sidebar */}
                <div className="w-48 hidden md:flex flex-col space-y-3">
                  <div className="h-4 w-24 bg-slate-200 rounded-md mb-4"></div>
                  <div className="h-8 w-full bg-slate-200 rounded-md"></div>
                  <div className="h-8 w-full bg-slate-100 rounded-md"></div>
                  <div className="h-8 w-full bg-slate-100 rounded-md"></div>
                </div>
                {/* Main Content */}
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="h-8 w-1/3 bg-slate-200 rounded-md"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-brand-light/40 rounded-xl border border-brand-border/30"></div>
                    <div className="h-24 bg-slate-100 rounded-xl"></div>
                    <div className="h-24 bg-slate-100 rounded-xl"></div>
                  </div>
                  <div className="flex-1 bg-white border border-slate-100 rounded-xl shadow-sm p-4 flex flex-col space-y-4">
                    <div className="h-6 w-1/4 bg-slate-200 rounded-md"></div>
                    <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="benefits" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16 space-y-4">
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            Maximize your candidate brand.
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-slate-500 font-medium">Automate feedback and put an end to the silent treatment.</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Large Card 1 */}
          <motion.div variants={fadeInUp} className="md:col-span-2 bg-[#F6F6F9] rounded-[2rem] p-8 md:p-12 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-primary/10 transition-colors duration-700" />
            <div className="relative z-10 space-y-4 max-w-md">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-primary mb-6">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Instant Compilations</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Generate personalized reviews in seconds. Powered by parallel worker queues to process massive applicant volumes effortlessly without breaking a sweat.
              </p>
            </div>
            {/* Visual Element */}
            <div className="mt-8 h-48 w-full bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 flex flex-col gap-2 relative z-10">
              <div className="h-8 w-3/4 bg-slate-100 rounded-md"></div>
              <div className="h-8 w-1/2 bg-slate-100 rounded-md"></div>
              <div className="h-8 w-full bg-brand-light rounded-md"></div>
            </div>
          </motion.div>

          {/* Small Card 1 */}
          <motion.div variants={fadeInUp} className="md:col-span-1 bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 mb-6 border border-slate-100">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Secure Sandboxed Relays</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                Protect real applicant inboxes during drafts. In development mode, every outbound template is securely redirected to a Resend test sandbox.
              </p>
            </div>
          </motion.div>

          {/* Small Card 2 */}
          <motion.div variants={fadeInUp} className="md:col-span-1 bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 mb-6 border border-slate-100">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Adaptive Reminders</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                Automated background routines check program dates, notifying managers to publish score reviews before cohorts feel abandoned.
              </p>
            </div>
          </motion.div>

          {/* Large Card 2 */}
          <motion.div variants={fadeInUp} className="md:col-span-2 bg-[#F6F6F9] rounded-[2rem] p-8 md:p-12 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10 space-y-4 max-w-md">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-primary mb-6">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Flexible Rubrics</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Establish custom criteria scales that grow with your accelerator. Adjust rubric weights seamlessly to align with new intake specs.
              </p>
            </div>
             {/* Visual Element */}
             <div className="mt-8 h-48 w-full flex items-end gap-4 relative z-10 px-4">
              <div className="w-1/4 bg-brand-border/40 h-24 rounded-t-xl"></div>
              <div className="w-1/4 bg-brand-primary/60 h-32 rounded-t-xl"></div>
              <div className="w-1/4 bg-brand-primary h-48 rounded-t-xl shadow-lg"></div>
              <div className="w-1/4 bg-brand-light h-16 rounded-t-xl"></div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16 space-y-4">
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            Everything you need.
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-slate-500 font-medium">Powerful features to streamline your process from end to end.</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Real-Time Ingestion",
              desc: "Connect directly to your applicant tracker via secure webhooks.",
              icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
            },
            {
              title: "AI-Powered Audit",
              desc: "Deep analysis of applicant profiles against your custom rubrics.",
              icon: <> <path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> </>,
            },
            {
              title: "Transparent Dispatches",
              desc: "Every email sent is logged and tracked for delivery analytics.",
              icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
            },
            {
              title: "Custom Rubrics",
              desc: "Define what matters most. Tailor the grading scale to your cohort.",
              icon: <> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /> </>,
            },
            {
              title: "Simplified Onboarding",
              desc: "Get started in minutes with direct CSV imports and intuitive mapping.",
              icon: <> <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /> </>,
            },
            {
              title: "Dedicated Support",
              desc: "24/7 priority assistance to ensure your program runs smoothly.",
              icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
            },
          ].map((feature, i) => (
            <motion.div variants={fadeInUp} key={i} className="p-8 rounded-[2rem] bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/60 flex flex-col items-start text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-sm border border-slate-200/50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Masonry / Marquee Area */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/60 overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-6xl mx-auto px-6 mb-12 text-center">
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tight text-slate-900">Loved by program managers</motion.h2>
        </motion.div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="flex gap-6 px-6 overflow-x-auto pb-8 snap-x hide-scrollbar max-w-7xl mx-auto">
          {testimonials.map((t, idx) => (
            <motion.div variants={fadeInUp} key={idx} className="min-w-[320px] md:min-w-[400px] snap-center bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex mb-6 text-brand-primary">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-base text-slate-700 font-medium leading-relaxed mb-8">
                "{t.quote}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-primary font-bold text-lg">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{t.author}</div>
                  <div className="text-sm text-slate-500 font-medium">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16 space-y-4">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Simple, transparent pricing.
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-slate-500 font-medium">Choose the perfect plan for your program.</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((p, idx) => (
            <motion.div
              variants={fadeInUp}
              key={p.name}
              className={`relative rounded-[2rem] p-8 md:p-10 flex flex-col bg-white transition-all duration-300
                ${p.popular 
                  ? "border-2 border-brand-primary shadow-[0_20px_40px_rgba(108,99,255,0.15)] md:-translate-y-4 z-10 scale-105" 
                  : "border border-slate-200 shadow-sm hover:shadow-md"
                }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name}</h3>
                <p className="text-sm text-slate-500 font-medium h-10">{p.desc}</p>
              </div>

              <div className="mb-8 flex items-baseline text-slate-900">
                <span className="text-5xl font-extrabold tracking-tight">{p.price}</span>
                <span className="text-base text-slate-500 font-medium ml-2">/mo</span>
              </div>

              <Link href="/signup" className="w-full mb-8">
                <button className={`w-full py-4 rounded-full font-bold text-sm transition-all duration-200
                  ${p.popular 
                    ? "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-md" 
                    : "bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200"
                  }`}>
                  {p.cta}
                </button>
              </Link>

              <ul className="space-y-4 text-sm text-slate-600 font-medium">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center mr-3 shrink-0">
                      <svg className="w-3 h-3 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16 space-y-4">
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Frequently asked questions
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                variants={fadeInUp}
                key={idx}
                onClick={() => toggleFaq(idx)}
                className={`bg-white border rounded-2xl p-6 cursor-pointer transition-all duration-200
                  ${isOpen ? "border-slate-300 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
              >
                <div className="flex justify-between items-center text-slate-900 font-semibold text-base">
                  <span>{faq.q}</span>
                  <span className={`transform transition-transform duration-200 flex-shrink-0 ml-4 ${isOpen ? "rotate-45" : "rotate-0"}`}>
                    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      <p className="pt-4 text-slate-500 font-medium leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-24 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto flex flex-col items-center">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to automate your candidate feedback?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-300 font-medium">
              Join hundreds of programs providing closure and protecting their brand reputation.
            </motion.p>
            <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-base px-8 py-4 rounded-full transition-all">
                  Get Started Now
                </button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-base px-8 py-4 rounded-full transition-all backdrop-blur-sm">
                  Contact Sales
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 text-center text-slate-500 text-sm font-medium">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
             <span className="w-6 h-6 bg-slate-900 text-white rounded-md flex items-center justify-center">
               <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M16 3h5v5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 21H3v-5" />
              </svg>
             </span>
             <span className="font-bold text-slate-900">Backlos</span>
          </div>
          <div className="space-x-6">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
          </div>
          <div>© {new Date().getFullYear()} Backlos. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
