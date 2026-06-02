"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Badge from "@/components/ui/Badge";
import { LayoutDashboard, FolderKanban, CreditCard, Sparkles, Settings } from "lucide-react";

interface SidebarProps {
  orgName: string;
  orgSlug: string;
  plan: string;
  userInitials: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  orgName,
  orgSlug,
  plan,
  userInitials,
}) => {
  const pathname = usePathname();

  const menuSections = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
        },
        {
          label: "Programs",
          href: "/dashboard/programs",
          icon: <FolderKanban className="w-5 h-5 mr-3" />,
        },
      ],
    },
    {
      title: "Configuration",
      items: [
        {
          label: "General Settings",
          href: "/dashboard/settings",
          icon: <Settings className="w-5 h-5 mr-3" />,
        },
        {
          label: "Billing",
          href: "/dashboard/billing",
          icon: <CreditCard className="w-5 h-5 mr-3" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-[260px] h-screen bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 select-none text-slate-900">
      {/* Brand Header */}
      <div className="h-[72px] px-6 flex items-center border-b border-slate-200 shrink-0">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="flex items-center justify-center w-8 h-8 bg-brand-primary text-white font-bold rounded-xl shadow-[0_4px_10px_rgba(108,99,255,0.3)] group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Backlos
          </span>
        </Link>
      </div>

      {/* Nav Menu Content */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto hide-scrollbar">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">
              {section.title}
            </span>
            {section.items.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className={`${isActive ? "text-brand-primary" : "text-slate-400"}`}>
                    {item.icon}
                  </div>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className="p-4 border-t border-slate-100 shrink-0 bg-white">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-3">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 bg-brand-light text-brand-primary font-bold flex items-center justify-center rounded-xl text-xs shrink-0 shadow-sm border border-brand-primary/20">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">
                {orgName}
              </span>
              <span className="text-[10px] font-medium text-slate-500 truncate">
                Workspace
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
            <Link
              href={`/org/${orgSlug}`}
              target="_blank"
              className="text-[10px] font-bold text-brand-primary hover:text-brand-primary/80 transition-colors uppercase tracking-wider"
            >
              Public Profile ↗
            </Link>
            <Badge variant={plan === "FREE" ? "secondary" : "primary"} className="text-[9px] px-1.5 py-0.5">
              {plan}
            </Badge>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
