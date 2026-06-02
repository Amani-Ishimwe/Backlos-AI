"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bell, LogOut, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <header className="h-[72px] bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 flex items-center justify-between shrink-0 select-none sticky top-0 z-40">
      {/* Search / Breadcrumb */}
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40 sm:text-sm transition-all"
            placeholder="Search programs, applicants..."
          />
        </div>
      </div>

      {/* Right Action Menu */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-brand-primary transition-colors focus:outline-none group"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5 group-hover:animate-swing" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full ring-2 ring-white"></span>
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none group"
          >
            <div className="w-9 h-9 bg-brand-light text-brand-primary border border-brand-primary/20 rounded-full flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer hover:bg-brand-primary hover:text-white transition-all shadow-sm">
              {userInitials}
            </div>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Back Drop Overlay */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Menu Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center space-x-3">
                     <div className="w-10 h-10 bg-brand-light text-brand-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {userInitials}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                        Signed in as
                      </p>
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors text-left group"
                    >
                      <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
