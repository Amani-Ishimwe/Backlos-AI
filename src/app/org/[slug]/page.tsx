import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface PublicOrgProps {
  params: {
    slug: string;
  };
}

export default async function PublicOrgProfilePage({ params }: PublicOrgProps) {
  const { slug } = params;

  // 1. Fetch organization details public profile
  const org = await prisma.org.findUnique({
    where: { slug },
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
  });

  if (!org) {
    notFound();
  }

  // 2. Compute public statistics
  const totalPrograms = org.programs.length;
  let totalCandidates = 0;
  let closedPrograms = 0;
  let closedWithFeedback = 0;

  org.programs.forEach((prog) => {
    totalCandidates += prog.applicants.length;

    if (prog.status === "CLOSED" || prog.status === "ACTIVE") {
      closedPrograms++;
      
      const sentCount = prog.applicants.filter(
        (app) => app.emailDelivery && app.emailDelivery.status === "SENT"
      ).length;

      // If at least 80% of applicants in a closed/active program received feedback, it is marked as sent!
      if (prog.applicants.length > 0 && sentCount >= Math.ceil(prog.applicants.length * 0.8)) {
        closedWithFeedback++;
      }
    }
  });

  // Calculate live accountability score
  const liveScore = closedPrograms > 0 
    ? Math.round((closedWithFeedback / closedPrograms) * 100) 
    : 0;

  // Update org delivery score in background to sync database
  try {
    await prisma.org.update({
      where: { id: org.id },
      data: { feedbackDeliveryScore: liveScore },
    });
  } catch (error) {
    console.error("Failed to update score back to org database:", error);
  }

  // Score Badge Color mapping
  const getScoreVariant = (score: number) => {
    if (score >= 80) return "success" as const;
    if (score >= 50) return "warning" as const;
    return "danger" as const;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Brand Attribution Header */}
        <header className="flex items-center justify-between border-b border-brand-light pb-6 select-none bg-white p-6 rounded-card border border-brand-border shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-8 h-8 bg-brand-primary text-white font-bold rounded-full text-base">
              ↺
            </span>
            <span className="text-xl font-bold tracking-tight text-brand-text">
              Backlos
            </span>
          </div>
          <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">
            Verified Accountability Audit Profile
          </span>
        </header>

        {/* 1. Profile Summary Card */}
        <Card className="p-8 border-brand-border shadow-premium">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-brand-primary text-white flex items-center justify-center font-bold text-xl rounded-btn shadow-sm select-none">
                  {org.name[0].toUpperCase()}
                </div>
                <h1 className="text-2xl font-bold text-brand-text leading-none">{org.name}</h1>
              </div>
              <p className="text-xs text-brand-muted max-w-sm leading-relaxed">
                This public audit page confirms that {org.name} values closure. Applicants to their cohorts are checked for feedback delivery status.
              </p>
            </div>

            {/* Large Accountability Score Badge */}
            <div className="text-center md:text-right border-t border-slate-100 pt-4 md:border-none md:pt-0">
              <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block mb-1">
                Accountability Score
              </span>
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <span className={`text-4xl font-bold ${
                  liveScore >= 80 ? "text-emerald-600" : liveScore >= 50 ? "text-amber-600" : "text-rose-600"
                }`}>
                  {liveScore}%
                </span>
                <Badge variant={getScoreVariant(liveScore)} className="capitalize">
                  {liveScore >= 80 ? "Premium Audit" : liveScore >= 50 ? "Standard" : "Flagged"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Public stats breakdown grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block mb-1">
              Programs Audited
            </span>
            <span className="text-3xl font-bold text-brand-text">{totalPrograms}</span>
          </Card>

          <Card className="p-6 text-center">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block mb-1">
              Applicants Served
            </span>
            <span className="text-3xl font-bold text-brand-text">{totalCandidates}</span>
          </Card>

          <Card className="p-6 text-center border-brand-primary bg-brand-light/20">
            <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block mb-1">
              Anti-Ghosting Ratio
            </span>
            <span className="text-3xl font-bold text-brand-primary">
              {liveScore}%
            </span>
          </Card>
        </div>

        {/* 3. Program registries list audit */}
        <Card className="border-brand-border p-0 overflow-hidden shadow-premium">
          <CardHeader className="p-6 border-b border-brand-light">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Cohort Audit Registry</CardTitle>
            <CardDescription>Verified status logs of previous cohorts hosted by this organization.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {org.programs.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-muted">
                No active program cohorts audited yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-light text-left text-xs bg-white">
                  <thead className="bg-slate-50 uppercase text-[10px] font-bold tracking-wider text-brand-muted select-none">
                    <tr>
                      <th className="px-6 py-4">Audited Cohort Name</th>
                      <th className="px-6 py-4">Cohort Type</th>
                      <th className="px-6 py-4 text-right">Applicants</th>
                      <th className="px-6 py-4 text-center">Feedback Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-light">
                    {org.programs.map((prog) => {
                      const totalApp = prog.applicants.length;
                      const sentApp = prog.applicants.filter(
                        (a) => a.emailDelivery && a.emailDelivery.status === "SENT"
                      ).length;

                      const isAuditedDone = totalApp > 0 && sentApp >= Math.ceil(totalApp * 0.8);

                      return (
                        <tr key={prog.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-bold text-brand-text">{prog.name}</td>
                          <td className="px-6 py-4 font-semibold text-brand-muted uppercase text-[10px]">
                            {prog.type}
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-medium">{totalApp}</td>
                          <td className="px-6 py-4 text-center">
                            {isAuditedDone ? (
                              <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                                Verified Dispatched ✓
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Incomplete Roster</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-xs text-brand-muted font-semibold pt-8 border-t border-brand-light">
          <p>Verified public audits by Backlos · Ensuring closed feedback closure for every applicant globally.</p>
        </footer>

      </div>
    </div>
  );
}
