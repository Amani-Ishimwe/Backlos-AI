"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

interface DashboardContainerProps {
  children: React.ReactNode;
  orgName: string;
  orgSlug: string;
  plan: string;
  userInitials: string;
  userEmail: string;
}

export default function DashboardContainer({
  children,
  orgName,
  orgSlug,
  plan,
  userInitials,
  userEmail,
}: DashboardContainerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      {/* Sidebar Backdrop Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 260px Sidebar */}
      <Sidebar
        orgName={orgName}
        orgSlug={orgSlug}
        plan={plan}
        userInitials={userInitials}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* 60px Topbar */}
        <Topbar
          userInitials={userInitials}
          userEmail={userEmail}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
