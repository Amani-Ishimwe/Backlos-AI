"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface TopbarProps {
  userInitials: string;
  userEmail: string;
}

const Topbar: React.FC<TopbarProps> = ({ userInitials, userEmail }) => {
  const router = useRouter();
  const supabase = createClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-[60px] bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 select-none z-10">
      {/* Dynamic Title / Breadcrumb */}
      <div>
        <h1 className="text-base font-bold text-brand-text">
          Console Overview
        </h1>
      </div>

      {/* Right Action Menu */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button
          className="p-1.5 rounded-btn hover:bg-slate-50 text-brand-muted hover:text-brand-primary transition-colors focus:outline-none"
          aria-label="View notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 bg-brand-light text-brand-primary border border-brand-border rounded-full flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer outline-none hover:bg-[#E2E0FF] transition-colors"
          >
            {userInitials}
          </button>

          {dropdownOpen && (
            <>
              {/* Back Drop Overlay */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />

              {/* Menu Card */}
              <div className="absolute right-0 mt-2 w-56 bg-white border border-brand-border rounded-card shadow-lg z-20 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-brand-light">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                    Signed in as
                  </p>
                  <p className="text-xs font-semibold text-brand-text truncate">
                    {userEmail}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 mt-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-btn transition-colors text-left"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
