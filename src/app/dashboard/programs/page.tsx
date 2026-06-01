import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/layout/EmptyState";

export default async function ProgramsListPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch user org details
  const membership = await prisma.orgMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) return null;

  const programs = await prisma.program.findMany({
    where: { orgId: membership.orgId },
    include: {
      applicants: {
        include: {
          emailDelivery: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4 border-b border-brand-light">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Programs Registry</h1>
          <p className="text-sm text-brand-muted mt-1">
            Deploy and manage cohorts, evaluation rubrics, and closure notifications.
          </p>
        </div>
        <Link href="/dashboard/programs/new">
          <Button variant="primary" size="sm">
            + New Program
          </Button>
        </Link>
      </div>

      {/* Grid List */}
      {programs.length === 0 ? (
        <EmptyState
          title="Create your first program"
          description="Build evaluation rubrics, upload applicant matrices, and send automated personalized AI feedback reports."
          actionLabel="Create program"
          actionHref="/dashboard/programs/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((program) => {
            const totalApplicants = program.applicants.length;
            const completedSent = program.applicants.filter(
              (a) => a.emailDelivery && a.emailDelivery.status === "SENT"
            ).length;
            
            const dispatchPercent = totalApplicants > 0 
              ? Math.round((completedSent / totalApplicants) * 100) 
              : 0;

            const statusColors = {
              DRAFT: "secondary" as const,
              ACTIVE: "primary" as const,
              CLOSED: "danger" as const,
            };

            return (
              <Card
                key={program.id}
                className="hover:border-brand-primary hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <CardContent className="p-0 space-y-4">
                  {/* Row 1: Badges */}
                  <div className="flex items-center justify-between">
                    <Badge variant={statusColors[program.status]}>
                      {program.status}
                    </Badge>
                    <Badge variant="primary">
                      {program.type}
                    </Badge>
                  </div>

                  {/* Row 2: Name */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-brand-text truncate">
                      {program.name}
                    </h3>
                    <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">
                      Deadline: {program.decisionDeadline ? new Date(program.decisionDeadline).toLocaleDateString() : "No deadline set"}
                    </p>
                  </div>

                  {/* Row 3: Stats */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">
                        Applicants
                      </span>
                      <span className="text-sm font-bold text-brand-text">
                        {totalApplicants}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">
                        Dispatched
                      </span>
                      <span className="text-sm font-bold text-brand-primary">
                        {dispatchPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link href={`/dashboard/programs/${program.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Open Control Room
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
