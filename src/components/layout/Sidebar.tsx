"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Badge from "@/components/ui/Badge";

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
          icon: (
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          ),
        },
        {
          label: "Programs",
          href: "/dashboard/programs",
          icon: (
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5-6h7.5A2.25 2.25 0 0113.5 6.75v10.5A2.25 2.25 0 0111.25 19.5H3.75A2.25 2.25 0 011.5 17.25V6.75A2.25 2.25 0 013.75 4.5zm10.5 0h7.5A2.25 2.25 0 0122.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-7.5v-15z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          label: "Billing",
          href: "/dashboard/billing",
          icon: (
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 002.25 19.5z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-[60px] px-6 flex items-center border-b border-slate-100 shrink-0">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-8 h-8 bg-brand-primary text-white font-bold rounded-full text-base">
            ↺
          </span>
          <span className="text-xl font-bold tracking-tight text-brand-text">
            Backlos
          </span>
        </Link>
      </div>

      {/* Nav Menu Content */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-muted block mb-2">
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
                  className={`flex items-center px-3 py-2 text-sm font-semibold rounded-btn transition-colors ${
                    isActive
                      ? "bg-brand-light text-brand-primary"
                      : "text-brand-muted hover:bg-slate-50 hover:text-brand-text"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className="p-4 border-t border-slate-100 shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 bg-brand-primary text-white font-semibold flex items-center justify-center rounded-full text-sm shrink-0 shadow-sm">
            {userInitials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-brand-text truncate">
              {orgName}
            </span>
            <Link
              href={`/org/${orgSlug}`}
              target="_blank"
              className="text-[10px] font-semibold text-brand-primary hover:underline truncate"
            >
              Public Accountability Url
            </Link>
          </div>
        </div>
        <Badge variant={plan === "FREE" ? "secondary" : "primary"}>
          {plan}
        </Badge>
      </div>
    </aside>
  );
};

export default Sidebar;
