import React from "react";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { MotionContainer, MotionItem } from "@/components/layout/MotionWrapper";
import { UserCircle, Building2, Key, AlertTriangle, Save, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const membership = await prisma.orgMember.findFirst({
    where: { userId: user.id },
    include: {
      org: true,
    },
  });

  if (!membership) return null;
  const { org } = membership;

  return (
    <MotionContainer className="space-y-8 pb-10">
      {/* Title Header */}
      <MotionItem className="pb-4 border-b border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">General Settings</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your personal profile, workspace preferences, and integrations.
          </p>
        </div>
      </MotionItem>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Workspace Settings */}
          <MotionItem className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center border border-brand-border/40">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Workspace Details</h2>
                <p className="text-xs font-medium text-slate-500">Update your organization's public brand.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Workspace Name</label>
                <input 
                  type="text" 
                  defaultValue={org.name}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Public URL Slug</label>
                <div className="flex items-center">
                  <span className="px-4 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-sm font-medium text-slate-500 select-none">
                    backlos.app/org/
                  </span>
                  <input 
                    type="text" 
                    defaultValue={org.slug}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Workspace
                </button>
              </div>
            </div>
          </MotionItem>

          {/* Personal Profile */}
          <MotionItem className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center border border-brand-border/40">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Personal Profile</h2>
                <p className="text-xs font-medium text-slate-500">Your account information.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user.user_metadata?.full_name || ""}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user.email}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Email changes require support verification.</p>
                </div>
              </div>
              <div className="pt-2">
                <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Update Profile
                </button>
              </div>
            </div>
          </MotionItem>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          
          {/* API Integrations */}
          <MotionItem className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-brand-primary/5 transition-colors" />
            
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200 mb-4 relative z-10">
              <Key className="w-5 h-5" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2 relative z-10">API Integrations</h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6 relative z-10">
              Connect Backlos to your internal ATS tools to automatically ingest applicant data and trigger evaluations via webhook.
            </p>
            
            <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all flex items-center justify-center relative z-10">
              Generate API Key <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </MotionItem>

          {/* Danger Zone */}
          <MotionItem className="bg-white rounded-[2rem] p-6 border border-rose-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 mb-4 relative z-10">
              <AlertTriangle className="w-5 h-5" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2 relative z-10">Danger Zone</h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6 relative z-10">
              Permanently delete this workspace, all programs, applicant rubrics, and associated billing history. This action cannot be undone.
            </p>
            
            <button className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all relative z-10">
              Delete Workspace
            </button>
          </MotionItem>
          
        </div>
      </div>
    </MotionContainer>
  );
}
