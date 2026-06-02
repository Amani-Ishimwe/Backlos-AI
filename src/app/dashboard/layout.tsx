import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient();

  // 1. Authenticate user server-side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch user organization and member profile details
  const membership = await prisma.orgMember.findFirst({
    where: { userId: user.id },
    include: {
      org: true,
    },
  });

  // If user signed up but org was failed to initialize, redirect to signup
  if (!membership) {
    redirect("/signup");
  }

  const { org } = membership;
  const userInitials = user.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : user.email?.substring(0, 2).toUpperCase() || "US";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* 260px Sidebar */}
      <Sidebar
        orgName={org.name}
        orgSlug={org.slug}
        plan={org.plan}
        userInitials={userInitials}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* 60px Topbar */}
        <Topbar userInitials={userInitials} userEmail={user.email || ""} />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
