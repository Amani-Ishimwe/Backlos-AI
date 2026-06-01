import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface ProgramOverviewProps {
  params: {
    id: string;
  };
}

export default async function ProgramOverviewPage({ params }: ProgramOverviewProps) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch program and related entities
  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: {
      criteria: true,
      applicants: {
        include: {
          report: true,
          emailDelivery: true,
        },
      },
    },
  });

  if (!program) {
    notFound();
  }

  // 2. Compute progress checklist steps
  const rubricCompleted = program.criteria.length > 0;
  const applicantsCompleted = program.applicants.length > 0;
  
  const readyReports = program.applicants.filter(
    (app) => app.report && app.report.status === "READY"
  ).length;
  const feedbackCompleted = applicantsCompleted && readyReports === program.applicants.length;

  const sentEmails = program.applicants.filter(
    (app) => app.emailDelivery && app.emailDelivery.status === "SENT"
  ).length;
  const dispatchCompleted = feedbackCompleted && sentEmails === program.applicants.length;

  // Stats Breakdown
  const totalApplicants = program.applicants.length;
  const openedEmails = program.applicants.filter(
    (app) => app.emailDelivery && app.emailDelivery.status === "OPENED"
  ).length;

  const steps = [
    {
      title: "1. Configure Rubric",
      description: "Define evaluation criteria weights totaling exactly 100%.",
      status: rubricCompleted ? ("COMPLETED" as const) : ("TODO" as const),
      href: `/dashboard/programs/${program.id}/rubric`,
      cta: rubricCompleted ? "Edit Rubric" : "Start Setup",
    },
    {
      title: "2. Applicant Scores Intake",
      description: "Upload CSV tables or manually insert scores for candidates.",
      status: !rubricCompleted 
        ? ("LOCKED" as const) 
        : applicantsCompleted 
        ? ("COMPLETED" as const) 
        : ("TODO" as const),
      href: `/dashboard/programs/${program.id}/applicants`,
      cta: applicantsCompleted ? "Manage Scores" : "Upload CSV",
    },
    {
      title: "3. AI Feedback Generator",
      description: "Trigger Google Gemini models in native JSON stats mode.",
      status: !applicantsCompleted
        ? ("LOCKED" as const)
        : feedbackCompleted
        ? ("COMPLETED" as const)
        : ("TODO" as const),
      href: `/dashboard/programs/${program.id}/feedback`,
      cta: feedbackCompleted ? "Preview Reports" : "Generate AI",
    },
    {
      title: "4. E-Closure Dispatcher",
      description: "Bulk dispatch branded feedback reports to all candidates.",
      status: !feedbackCompleted
        ? ("LOCKED" as const)
        : dispatchCompleted
        ? ("COMPLETED" as const)
        : ("TODO" as const),
      href: `/dashboard/programs/${program.id}/feedback`,
      cta: dispatchCompleted ? "Tracker Logs" : "Approve & Send",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-brand-light">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-brand-text">{program.name}</h1>
            <Badge variant="primary">{program.type}</Badge>
            <Badge variant="secondary">{program.status}</Badge>
          </div>
          <p className="text-xs text-brand-muted font-bold uppercase tracking-wider">
            Decision deadline: {program.decisionDeadline ? new Date(program.decisionDeadline).toLocaleDateString() : "No deadline set"}
          </p>
        </div>
        <Link href="/dashboard/programs">
          <Button variant="outline" size="sm">
            &larr; Back to Registry
          </Button>
        </Link>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="p-4 flex flex-col justify-center">
          <CardDescription className="text-[10px] font-bold uppercase tracking-wider mb-1">
            Total Candidates
          </CardDescription>
          <span className="text-2xl font-bold text-brand-text">{totalApplicants}</span>
        </Card>

        <Card className="p-4 flex flex-col justify-center">
          <CardDescription className="text-[10px] font-bold uppercase tracking-wider mb-1">
            AI Feedback Ready
          </CardDescription>
          <span className="text-2xl font-bold text-brand-primary">{readyReports}</span>
        </Card>

        <Card className="p-4 flex flex-col justify-center">
          <CardDescription className="text-[10px] font-bold uppercase tracking-wider mb-1">
            Closure Dispatches Sent
          </CardDescription>
          <span className="text-2xl font-bold text-emerald-600">{sentEmails}</span>
        </Card>

        <Card className="p-4 flex flex-col justify-center">
          <CardDescription className="text-[10px] font-bold uppercase tracking-wider mb-1">
            Audience Opened Ratio
          </CardDescription>
          <span className="text-2xl font-bold text-brand-text">
            {sentEmails > 0 ? `${Math.round((openedEmails / sentEmails) * 100)}%` : "0%"}
          </span>
        </Card>
      </div>

      {/* Workflow Checklist Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-brand-text">Integration Checklist Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "COMPLETED";
            const isLocked = step.status === "LOCKED";
            
            return (
              <Card 
                key={idx} 
                className={`flex flex-col justify-between p-6 ${
                  isLocked ? "opacity-50 select-none bg-slate-50 border-slate-200" : ""
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-brand-text">{step.title}</h3>
                    {isCompleted ? (
                      <Badge variant="success" className="bg-emerald-50 text-emerald-700">✓ Done</Badge>
                    ) : isLocked ? (
                      <Badge variant="secondary">🔐 Locked</Badge>
                    ) : (
                      <Badge variant="primary">⚡ Action Required</Badge>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-4 flex justify-end">
                  {isLocked ? (
                    <Button variant="outline" size="sm" disabled>
                      Complete previous steps first
                    </Button>
                  ) : (
                    <Link href={step.href}>
                      <Button variant={isCompleted ? "secondary" : "primary"} size="sm">
                        {step.cta}
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
