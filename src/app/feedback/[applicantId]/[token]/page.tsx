import React from "react";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { verifyReportToken } from "@/utils/reportToken";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface PublicReportProps {
  params: Promise<{ applicantId: string; token: string }>;
}

export default async function PublicReportPage({ params }: PublicReportProps) {
  const { applicantId, token } = await params;

  // 1. Cryptographically audit the URL signature to protect applicant privacy
  const isSignatureValid = verifyReportToken(applicantId, token);
  if (!isSignatureValid) {
    // Return a 403 or redirect to invalid token page
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
        <Card className="max-w-md p-8 border-rose-300 text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-rose-200 select-none">
            !
          </div>
          <h2 className="text-lg font-bold text-brand-text mb-2">Access Signature Expired</h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            The cryptographic key verification for this applicant URL signature failed. Please request a fresh report check link from your program administrator.
          </p>
        </Card>
      </div>
    );
  }

  // 2. Fetch the applicant, program rubric criteria, and report details
  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    include: {
      report: true,
      program: {
        include: {
          org: true,
          criteria: true,
        },
      },
      scores: true,
    },
  });

  if (!applicant || !applicant.report) {
    notFound();
  }

  const { report, program } = applicant;
  const isAccepted = applicant.status === "ACCEPTED";

  // 3. Mark delivery receipt as OPENED in the background
  try {
    await prisma.emailDelivery.upsert({
      where: { applicantId: applicant.id },
      update: {
        status: "OPENED",
        openedAt: new Date(),
      },
      create: {
        applicantId: applicant.id,
        status: "OPENED",
        openedAt: new Date(),
        sentAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to update opened statistics:", error);
  }

  // Server-side Pendo track: feedback report viewed
  try {
    await fetch("https://data.pendo.io/data/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-pendo-integration-key": "709225bf-7a1a-4eee-8774-717dac3dcf10",
      },
      body: JSON.stringify({
        type: "track",
        event: "feedback_report_viewed",
        visitorId: applicant.id,
        accountId: program.org.id,
        timestamp: Date.now(),
        properties: {
          applicantId: applicant.id,
          programId: program.id,
          programName: program.name,
          orgName: program.org.name,
          applicantStatus: applicant.status,
        },
      }),
    });
  } catch (error) {
    console.error("Failed to send Pendo track event:", error);
  }

  // Calculate pool metrics to display criteria averages
  // We can fetch scores map to show criteria bars
  const criteriaList = program.criteria.map((c) => {
    const scoreObj = applicant.scores.find((s) => s.criteriaId === c.id);
    const score = scoreObj ? scoreObj.score : 0;
    
    // Attempt to parse criteria insight from report breakdown
    const reportBreakdown = (report.criteriaBreakdown as any[]) || [];
    const breakdownItem = reportBreakdown.find(
      (b: any) => String(b?.criteriaName).toLowerCase() === c.name.toLowerCase()
    );

    return {
      name: c.name,
      score,
      percentile: breakdownItem?.percentile || 50,
      insight: breakdownItem?.insight || "Your core metrics were successfully audited against standard averages.",
    };
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Brand Attribution Header */}
        <header className="flex items-center justify-between border-b border-brand-light pb-6 bg-white p-6 rounded-card shadow-sm border border-brand-border">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-8 h-8 bg-brand-primary text-white font-bold rounded-full text-base">
              ↺
            </span>
            <span className="text-xl font-bold tracking-tight text-brand-text">
              Backlos
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">
              Program Hosted By
            </span>
            <span className="text-sm font-bold text-brand-text">
              {program.org.name}
            </span>
          </div>
        </header>

        {/* 1. Decision Card Banner */}
        <Card className={`p-8 border-1.5 shadow-premium ${
          isAccepted ? "border-emerald-300 bg-emerald-50/20" : "border-brand-border bg-white"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant="primary">{program.type}</Badge>
                <h1 className="text-xl font-bold text-brand-text">{program.name}</h1>
              </div>
              <p className="text-xs text-brand-muted font-semibold uppercase tracking-wider">
                Application closed & evaluated
              </p>
            </div>

            <div>
              {isAccepted ? (
                <span className="px-6 py-2.5 rounded-badge bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-sm shadow-sm inline-block">
                  Accepted 🎉
                </span>
              ) : (
                <span className="px-6 py-2.5 rounded-badge bg-brand-light border border-brand-border text-brand-primary font-bold text-sm shadow-sm inline-block">
                  Application Reviewed
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* 2. Percentile callout & summary card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 p-6 flex flex-col justify-center text-center bg-slate-900 text-white border-none">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Performance Index
            </span>
            <span className="text-5xl font-bold text-brand-primary block mb-2">
              Top {Math.round(100 - report.overallPercentile)}%
            </span>
            <p className="text-[11px] text-slate-300 max-w-[200px] mx-auto leading-relaxed">
              Your overall application scored in the top percentile bracket of the candidate pool.
            </p>
          </Card>

          <Card className="md:col-span-2 border-brand-primary p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block">
                Submission Analysis Overview
              </span>
              <p className="text-sm text-brand-text leading-relaxed font-medium">
                {report.summary}
              </p>
            </div>
            
            <div className="bg-brand-light p-4 rounded-btn border border-brand-border mt-4 flex items-start">
              <span className="mr-2 text-brand-primary text-base select-none font-bold">✦</span>
              <div className="space-y-0.5">
                <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block">Highlighted Core Strength</span>
                <p className="text-xs font-bold text-brand-text">{report.strengthHighlight}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. Criteria scores breakdown section */}
        <Card className="border-brand-border p-8 space-y-6">
          <div className="border-b border-brand-light pb-4">
            <h2 className="text-lg font-bold text-brand-text">Rubric Criteria Breakdown</h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              Your scored performance vs. program standard average metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {criteriaList.map((crit, idx) => (
              <div key={idx} className="space-y-3 p-4 bg-slate-50/50 rounded-btn border border-slate-100">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-brand-text truncate max-w-[200px]">{crit.name}</span>
                  <span className="text-brand-primary font-mono text-sm">{crit.score}/100</span>
                </div>

                <div className="w-full h-3 bg-white border border-slate-200 rounded-badge overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-badge" style={{ width: `${crit.score}%` }} />
                </div>

                <p className="text-[11px] text-brand-muted leading-normal font-medium italic">
                  {crit.insight}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Improvement areas vs next steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-brand-border p-6 space-y-4">
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-light pb-2">
              Focus Areas for Development
            </h3>
            <ol className="list-decimal pl-5 text-xs text-brand-text space-y-3 leading-relaxed font-semibold">
              {(report.improvementAreas as string[]).map((area, idx) => (
                <li key={idx} className="marker:text-brand-primary">{area}</li>
              ))}
            </ol>
          </Card>

          <Card className="border-brand-border p-6 space-y-4">
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider border-b border-brand-light pb-2">
              Actionable Next Steps
            </h3>
            <ul className="list-none pl-0 text-xs text-brand-text space-y-3 leading-relaxed font-semibold">
              {(report.nextSteps as string[]).map((step, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-brand-primary font-bold mr-2">✓</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* 5. Bottom CTA footer */}
        <footer className="text-center pt-8 border-t border-brand-light text-xs text-brand-muted font-semibold space-y-4">
          <p>Powered by Backlos · Closing the loop for every single applicant worldwide.</p>
          {!isAccepted && (
            <Link href="https://backlos.app" target="_blank">
              <Button variant="outline" size="sm">
                Apply again when ready
              </Button>
            </Link>
          )}
        </footer>

      </div>
    </div>
  );
}
