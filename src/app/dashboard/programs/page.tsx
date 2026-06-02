import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/layout/EmptyState";
import { MotionContainer, MotionItem } from "@/components/layout/MotionWrapper";
import { Plus, ChevronRight, CheckCircle2, Clock } from "lucide-react";

export default async function ProgramsListPage() {
  const supabase = await createClient();

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
    <MotionContainer className="space-y-8 pb-10">
      {/* Header Section */}
      <MotionItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Programs Registry</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Deploy and manage cohorts, evaluation rubrics, and closure notifications.
          </p>
        </div>
        <Link href="/dashboard/programs/new">
          <button className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center">
            <Plus className="w-4 h-4 mr-1.5" />
            New Program
          </button>
        </Link>
      </MotionItem>

      {/* Grid List */}
      {programs.length === 0 ? (
        <MotionItem>
          <EmptyState
            title="Create your first program"
            description="Build evaluation rubrics, upload applicant matrices, and send automated personalized AI feedback reports."
            actionLabel="Create program"
            actionHref="/dashboard/programs/new"
          />
        </MotionItem>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => {
            const totalApplicants = program.applicants.length;
            const completedSent = program.applicants.filter(
              (a) => a.emailDelivery && a.emailDelivery.status === "SENT"
            ).length;
            
            const dispatchPercent = totalApplicants > 0 
              ? Math.round((completedSent / totalApplicants) * 100) 
              : 0;

            const isCompleted = dispatchPercent === 100 && totalApplicants > 0;

            const statusColors = {
              DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
              ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
              CLOSED: "bg-red-50 text-red-700 border-red-200",
            };

            return (
              <MotionItem
                key={program.id}
                className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-brand-primary hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/5 transition-colors pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  {/* Row 1: Badges */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${statusColors[program.status]}`}>
                      {program.status}
                    </span>
                    <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider">
                      {program.type}
                    </Badge>
                  </div>

                  {/* Row 2: Name */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1">
                      {program.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Deadline: {program.decisionDeadline ? new Date(program.decisionDeadline).toLocaleDateString() : "No deadline set"}
                    </p>
                  </div>

                  {/* Row 3: Stats Box */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Applicants
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {totalApplicants}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Dispatched
                      </span>
                      <span className="text-sm font-bold text-brand-primary flex items-center">
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />}
                        {!isCompleted && totalApplicants > 0 && <Clock className="w-3.5 h-3.5 mr-1 text-brand-primary" />}
                        {dispatchPercent}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-brand-primary'}`} 
                        style={{ width: `${dispatchPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-6 relative z-10">
                  <Link href={`/dashboard/programs/${program.id}`}>
                    <button className="w-full bg-white border-2 border-slate-100 group-hover:border-brand-primary/30 text-slate-600 group-hover:text-brand-primary font-semibold text-sm px-4 py-3 rounded-xl transition-all flex items-center justify-center group/btn">
                      Open Control Room
                      <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                    </button>
                  </Link>
                </div>
              </MotionItem>
            );
          })}
        </div>
      )}
    </MotionContainer>
  );
}
