import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import DashboardContainer from "@/components/layout/DashboardContainer";

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
    <DashboardContainer
      orgName={org.name}
      orgSlug={org.slug}
      plan={org.plan}
      userInitials={userInitials}
      userEmail={user.email || ""}
    >
      {children}
    </DashboardContainer>
  );
}
