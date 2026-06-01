import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/layout/EmptyState";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch user org details
  const membership = await prisma.orgMember.findFirst({
    where: { userId: user.id },
    include: {
      org: {
        include: {
          programs: {
            include: {
              applicants: {
                include: {
                  emailDelivery: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!membership) return null;
  const { org } = membership;

  // 2. Compute Dashboard statistics
  const totalPrograms = org.programs.length;
  
  let totalApplicants = 0;
  let feedbackSent = 0;
  
  org.programs.forEach((prog) => {
    totalApplicants += prog.applicants.length;
    
    const sentCount = prog.applicants.filter(
      (app) => app.emailDelivery && app.emailDelivery.status === "SENT"
    ).length;
    
    feedbackSent += sentCount;
  });

  const sentPercent = totalApplicants > 0 
    ? Math.round((feedbackSent / totalApplicants) * 100) 
    : 0;

  // Recent Programs (limit 3)
  const recentPrograms = [...org.programs]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dynamic Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-text">
            Welcome back, {user.user_metadata?.full_name?.split(" ")[0] || "Organizer"}
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            Let's ensure zero applicants get ghosted today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/org/${org.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6a2.25 2.25 0 00-2.25-2.25H15M9 10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM19.5 10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM9 19.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              Public Profile
            </Button>
          </Link>
          <Link href="/dashboard/programs/new">
            <Button variant="primary" size="sm">
              + New Program
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <CardDescription className="text-xs uppercase font-bold tracking-wider mb-2">
            Programs Moderated
          </CardDescription>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-brand-text">{totalPrograms}</span>
            <span className="text-xs text-brand-muted font-semibold">programs</span>
          </div>
        </Card>

        <Card className="p-6">
          <CardDescription className="text-xs uppercase font-bold tracking-wider mb-2">
            Applicants Served
          </CardDescription>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-brand-text">{totalApplicants}</span>
            <span className="text-xs text-brand-muted font-semibold">individuals</span>
          </div>
        </Card>

        <Card className="p-6">
          <CardDescription className="text-xs uppercase font-bold tracking-wider mb-2">
            Feedback Sent Ratio
          </CardDescription>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-brand-text">{sentPercent}%</span>
            <span className="text-xs text-brand-muted font-semibold">completed</span>
          </div>
        </Card>

        <Card className="p-6 border-brand-primary bg-brand-light/35">
          <CardDescription className="text-xs uppercase font-bold tracking-wider mb-2 text-brand-primary">
            Accountability Score
          </CardDescription>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-brand-primary">
              {Math.round(org.feedbackDeliveryScore)}%
            </span>
            <Badge variant="primary" className="ml-2 bg-brand-primary text-white border-none">
              {org.feedbackDeliveryScore >= 80 ? "Premium" : "Reviewing"}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Lower Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Programs List (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-brand-text">Recent Programs</h2>
          
          {totalPrograms === 0 ? (
            <EmptyState
              title="No programs running"
              description="Deploy your first program with a custom evaluation rubric to start providing applicants with AI closure reviews."
              actionLabel="Create new program"
              actionHref="/dashboard/programs/new"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recentPrograms.map((prog) => {
                const applicantsCount = prog.applicants.length;
                const completedCount = prog.applicants.filter(
                  (a) => a.emailDelivery && a.emailDelivery.status === "SENT"
                ).length;
                const percent = applicantsCount > 0 
                  ? Math.round((completedCount / applicantsCount) * 100) 
                  : 0;

                return (
                  <Card key={prog.id} className="hover:border-brand-primary hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Link href={`/dashboard/programs/${prog.id}`}>
                            <span className="text-base font-bold text-brand-text hover:text-brand-primary hover:underline cursor-pointer">
                              {prog.name}
                            </span>
                          </Link>
                          <Badge variant="primary" className="text-[10px]">
                            {prog.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-brand-muted font-medium">
                          Created on {new Date(prog.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <span className="text-xs text-brand-muted uppercase font-bold tracking-wider block">
                            Applicants
                          </span>
                          <span className="text-sm font-bold text-brand-text">
                            {applicantsCount}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-brand-muted uppercase font-bold tracking-wider block">
                            Dispatched
                          </span>
                          <span className="text-sm font-bold text-brand-primary">
                            {percent}%
                          </span>
                        </div>

                        <Link href={`/dashboard/programs/${prog.id}`}>
                          <Button variant="outline" size="sm">
                            Open
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}

              <div className="text-right">
                <Link href="/dashboard/programs" className="text-sm font-semibold text-brand-primary hover:underline">
                  View all programs &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tips & Accountability Card (Right 1 column) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-brand-text">Platform Accountability</h2>
          <Card className="p-6 bg-slate-900 text-white border-none shadow-premium relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-slate-800 font-bold text-9xl select-none opacity-20">
              ↺
            </div>
            <h3 className="text-base font-bold mb-2">Every applicant deserves closure.</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Organizations that ghost applicants lose top-tier reputation points. Backlos publishes 
              verified accountability audits for public scrutiny.
            </p>
            <div className="border-t border-slate-800 pt-4 mt-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Your Public Score URL
              </span>
              <Link 
                href={`/org/${org.slug}`} 
                target="_blank" 
                className="text-xs font-semibold text-brand-primary hover:underline truncate block"
              >
                backlos.app/org/{org.slug}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
