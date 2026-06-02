import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/layout/EmptyState";
import { MotionContainer, MotionItem } from "@/components/layout/MotionWrapper";
import { 
  Users, 
  FolderKanban, 
  Send, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Activity 
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

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

  // Recent Programs (limit 5 to show more in a sleeker list)
  const recentPrograms = [...org.programs]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const accountabilityScore = Math.round(org.feedbackDeliveryScore);
  const scoreCircumference = 2 * Math.PI * 36; // r=36
  const scoreOffset = scoreCircumference - (accountabilityScore / 100) * scoreCircumference;

  return (
    <MotionContainer className="space-y-8 pb-10">
      {/* Premium Welcome Banner */}
      <MotionItem className="relative overflow-hidden rounded-[2rem] bg-white p-8 md:p-10 border border-slate-200 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></span>
              <span className="text-sm font-semibold text-brand-primary tracking-wide uppercase">Workspace Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">
              Welcome back, {user.user_metadata?.full_name?.split(" ")[0] || "Organizer"}.
            </h1>
            <p className="text-slate-500 text-base max-w-xl leading-relaxed">
              Here is your organization's pulse. Deliver rapid closure to your applicants and build an unstoppable brand reputation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href={`/org/${org.slug}`} target="_blank" className="w-full sm:w-auto">
              <button className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm px-6 py-3 rounded-full transition-all flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Public Profile
              </button>
            </Link>
            <Link href="/dashboard/programs/new" className="w-full sm:w-auto">
              <button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-[0_8px_20px_rgba(108,99,255,0.25)] transition-all hover:-translate-y-0.5 flex items-center justify-center">
                + New Program
              </button>
            </Link>
          </div>
        </div>
      </MotionItem>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MotionItem className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-bold text-slate-900">{totalPrograms}</h3>
            <p className="text-sm font-medium text-slate-500">Programs Moderated</p>
          </div>
        </MotionItem>

        <MotionItem className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Users className="w-5 h-5" />
            </div>
            {/* Minimalist decorative graph */}
            <svg className="w-16 h-8 text-emerald-100" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0 30 L20 20 L40 25 L60 10 L80 15 L100 5 V30 Z" fill="currentColor" />
              <path d="M0 30 L20 20 L40 25 L60 10 L80 15 L100 5" fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-bold text-slate-900">{totalApplicants}</h3>
            <p className="text-sm font-medium text-slate-500">Applicants Served</p>
          </div>
        </MotionItem>

        <MotionItem className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-bold text-slate-900">{sentPercent}%</h3>
            <p className="text-sm font-medium text-slate-500">Feedback Dispatched</p>
          </div>
          {/* Progress Bar under stat */}
          <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${sentPercent}%` }} />
          </div>
        </MotionItem>

        <MotionItem className="bg-gradient-to-br from-brand-primary to-[#938EFF] rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(108,99,255,0.2)] text-white flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center space-x-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm mb-4">
              <Activity className="w-3.5 h-3.5" />
              <span>Health Score</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">Accountability</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">Premium</h3>
            </div>
          </div>
          {/* SVG Circular Progress Ring */}
          <div className="relative z-10 w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
              <circle 
                cx="40" cy="40" r="36" 
                fill="none" 
                stroke="white" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeDasharray={scoreCircumference}
                strokeDashoffset={scoreOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-bold text-white">{accountabilityScore}</span>
            </div>
          </div>
        </MotionItem>
      </div>

      {/* Lower Dashboard Section: Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Programs Table (Left 2 cols) */}
        <MotionItem className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Programs</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Track your active evaluations and dispatches.</p>
              </div>
              <Link href="/dashboard/programs">
                <Button variant="outline" size="sm" className="hidden sm:flex text-slate-600 font-semibold rounded-full border-slate-200 hover:bg-slate-50">
                  View All <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {totalPrograms === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No programs running"
                  description="Deploy your first program with a custom evaluation rubric to start providing applicants with AI closure reviews."
                  actionLabel="Create new program"
                  actionHref="/dashboard/programs/new"
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentPrograms.map((prog) => {
                      const applicantsCount = prog.applicants.length;
                      const completedCount = prog.applicants.filter(
                        (a) => a.emailDelivery && a.emailDelivery.status === "SENT"
                      ).length;
                      const percent = applicantsCount > 0 
                        ? Math.round((completedCount / applicantsCount) * 100) 
                        : 0;
                      
                      const isCompleted = percent === 100 && applicantsCount > 0;

                      return (
                        <tr key={prog.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200/60">
                                {prog.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <Link href={`/dashboard/programs/${prog.id}`}>
                                  <span className="text-sm font-bold text-slate-900 hover:text-brand-primary transition-colors cursor-pointer">
                                    {prog.name}
                                  </span>
                                </Link>
                                <div className="text-xs font-medium text-slate-500 mt-0.5">
                                  {applicantsCount} {applicantsCount === 1 ? 'applicant' : 'applicants'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {isCompleted ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                <Clock className="w-3 h-3 mr-1" />
                                In Progress
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center space-x-3 max-w-[120px]">
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-brand-primary'}`} 
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-700">{percent}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <Link href={`/dashboard/programs/${prog.id}`}>
                              <button className="text-sm font-semibold text-slate-500 hover:text-brand-primary bg-white border border-slate-200 hover:border-brand-primary/30 px-3 py-1.5 rounded-lg shadow-sm transition-all opacity-0 group-hover:opacity-100">
                                Manage
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </MotionItem>

        {/* Reputation Panel (Right 1 col) */}
        <MotionItem className="lg:col-span-1">
          <div className="bg-gradient-to-br from-brand-primary to-[#938EFF] rounded-[2rem] p-8 shadow-[0_12px_30px_rgba(108,99,255,0.2)] relative overflow-hidden flex flex-col h-full text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-bold mb-3">Build your reputation.</h3>
            <p className="text-white/90 text-sm font-medium leading-relaxed mb-8 flex-1">
              Top-tier candidates prefer programs that provide closure. Your accountability score is public. By maintaining a high dispatch ratio, you attract better talent in future cohorts.
            </p>
            
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 mt-auto">
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider block mb-2">
                Public Transparency URL
              </span>
              <div className="flex items-center justify-between">
                <Link 
                  href={`/org/${org.slug}`} 
                  target="_blank" 
                  className="text-sm font-bold text-white hover:text-white/90 transition-colors truncate"
                >
                  backlos.app/org/{org.slug}
                </Link>
                <ArrowUpRight className="w-4 h-4 text-white/80" />
              </div>
            </div>
          </div>
        </MotionItem>

      </div>
    </MotionContainer>
  );
}
