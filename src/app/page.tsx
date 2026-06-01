import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      desc: "Perfect for single hackathons and standard grant registries.",
      features: [
        "Up to 200 applicants / month",
        "Standard Gemini feedback reviews",
        "CSV Intake & manual entries",
        "Resend email dispatch system",
        "Public Accountability portal",
      ],
      cta: "Start Free Trial",
      priceId: "price_starter",
      popular: false,
    },
    {
      name: "Growth",
      price: "$199",
      desc: "Ideal for high-velocity accelerators and job registry portals.",
      features: [
        "Up to 2,000 applicants / month",
        "Gemini-Flash premium feedback",
        "Priority parallel compilation runs",
        "White-labeled applicant portals",
        "Priority email dispatches & audits",
        "Anti-Ghosting daily reminders",
      ],
      cta: "Deploy Growth Plan",
      priceId: "price_growth",
      popular: true,
    },
    {
      name: "Scale",
      price: "$599",
      desc: "Built for massive enterprise fellowships and universities.",
      features: [
        "Up to 10,000 applicants / month",
        "Gemini-Pro advanced models",
        "SLA guaranteed dispatches",
        "Dedicated database clusters",
        "Anti-Ghosting automated escalation",
        "24/7 Priority support hotline",
      ],
      cta: "Contact Enterprise Sales",
      priceId: "price_scale",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-brand-text font-sans selection:bg-brand-light select-none">
      
      {/* 1. Global Branded Header Navbar */}
      <header className="max-w-6xl mx-auto h-20 px-6 flex items-center justify-between border-b border-brand-light">
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-8 h-8 bg-brand-primary text-white font-bold rounded-full text-base">
            ↺
          </span>
          <span className="text-xl font-bold tracking-tight text-brand-text">
            Backlos
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-brand-muted">
          <a href="#problem" className="hover:text-brand-primary transition-colors">The Ghosting Epidemic</a>
          <a href="#how-it-works" className="hover:text-brand-primary transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/login">
            <button className="text-sm font-bold text-brand-muted hover:text-brand-text transition-colors">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">
              Start Free
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center space-x-1.5 bg-brand-light border border-brand-border px-3 py-1 rounded-badge text-brand-primary text-xs font-bold uppercase tracking-wider animate-pulse">
          <span>✦</span>
          <span>B2B Feedback Delivery Platform</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-brand-text leading-tight max-w-3xl mx-auto">
          Every applicant deserves <span className="text-brand-primary relative">closure.</span>
        </h1>
        
        <p className="text-base sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed font-medium">
          Ensure that every single applicant to your accelerator, hackathon, grant, or job opening receives structured, personalized, AI-generated feedback. No candidate gets ghosted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3.5 shadow-md">
              Start anti-ghosting now
            </Button>
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full px-8 py-3.5">
              See how it works
            </Button>
          </a>
        </div>

        {/* Small statistics ticker */}
        <div className="border-t border-brand-light pt-8 max-w-xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <span className="text-lg font-bold text-brand-primary block">500K+</span>
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">hackathons run</span>
          </div>
          <div>
            <span className="text-lg font-bold text-brand-primary block">1.5B</span>
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">job submissions</span>
          </div>
          <div>
            <span className="text-lg font-bold text-brand-primary block">~0%</span>
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">received feedback</span>
          </div>
        </div>
      </section>

      {/* 3. The Problem Section */}
      <section id="problem" className="bg-slate-50/50 border-y border-brand-light py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-brand-text">The Ghosting Epidemic</h2>
            <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
              Why leading candidate brands are bleeding reputation metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-brand-border">
              <div className="w-10 h-10 bg-brand-light text-brand-primary flex items-center justify-center font-bold text-lg rounded-btn mb-4 select-none">
                ⚙
              </div>
              <h3 className="text-base font-bold text-brand-text mb-2">Accelerator Programs</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Founders spend weeks writing extensive pitch decks, only to receive a automated "we regret to inform you" rejection. We compile score audits instantly.
              </p>
            </Card>

            <Card className="p-8 border-brand-border">
              <div className="w-10 h-10 bg-brand-light text-brand-primary flex items-center justify-center font-bold text-lg rounded-btn mb-4 select-none">
                ↺
              </div>
              <h3 className="text-base font-bold text-brand-text mb-2">Hackathon Panels</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Developers code non-stop for 48 hours. When they don't win, they never learn why. Backlos parses judge points into actionable development matrices.
              </p>
            </Card>

            <Card className="p-8 border-brand-border">
              <div className="w-10 h-10 bg-brand-light text-brand-primary flex items-center justify-center font-bold text-lg rounded-btn mb-4 select-none">
                ✦
              </div>
              <h3 className="text-base font-bold text-brand-text mb-2">University HR Teams</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Receiving 10,000 resumes makes custom review dispatches impossible. Backlos lets you bulk sync scores and release reports with standard Resend SMTP dispatches.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. How it Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-brand-text">Three Steps to Anti-Ghosting</h2>
          <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
            Integrate rubrics, sync CSV files, and launch automated Gemini queues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="space-y-4">
            <span className="text-4xl font-extrabold text-brand-primary opacity-30">01</span>
            <h3 className="text-base font-bold text-brand-text">Configure Evaluation Rubric</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Use our interactive drag Rubric Builder to define metrics weights (e.g. Design 30%, Tech 70%) totaling exactly 100%.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-4xl font-extrabold text-brand-primary opacity-30">02</span>
            <h3 className="text-base font-bold text-brand-text">Drop in Candidate Scores</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Import evaluation results using a standard CSV table or manually insert score records with judge comments.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-4xl font-extrabold text-brand-primary opacity-30">03</span>
            <h3 className="text-base font-bold text-brand-text">Approve & Dispatched Reports</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Gemini writes beautiful custom reports. Review them on our preview dashboard, then bulk send SMTP closure emails.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Pricing Cards Grid Section */}
      <section id="pricing" className="bg-slate-50/50 border-t border-brand-light py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-brand-text">Sane pricing plans</h2>
            <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
              Choose the Anti-Ghosting tier that matches your candidate registry limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <Card
                key={p.name}
                className={`p-8 border-1.5 flex flex-col justify-between relative bg-white
                  ${p.popular ? "border-brand-primary shadow-lg ring-1 ring-brand-primary" : "border-brand-border shadow-premium"}`}
              >
                {p.popular && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-brand-light text-brand-primary text-[10px] font-bold uppercase tracking-wider rounded-badge">
                    Most Popular
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-brand-text">{p.name}</h3>
                    <p className="text-xs text-brand-muted mt-1 leading-normal">{p.desc}</p>
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
                  <Link href="/signup">
                    <Button variant={p.popular ? "primary" : "outline"} className="w-full font-bold">
                      {p.cta}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-brand-light flex flex-col md:flex-row md:items-center md:justify-between text-xs text-brand-muted space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-6 h-6 bg-brand-primary text-white font-bold rounded-full text-xs select-none">
            ↺
          </span>
          <span className="font-bold text-brand-text">Backlos</span>
          <span>&middot; every applicant deserves closure.</span>
        </div>

        <div className="flex items-center space-x-6 font-semibold">
          <Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link>
          <a href="mailto:support@backlos.app" className="hover:text-brand-primary transition-colors">Contact support</a>
        </div>

        <div>
          <span>Rwanda &bull; 2026</span>
        </div>
      </footer>

    </div>
  );
}
