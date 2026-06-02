import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const membership = await prisma.orgMember.findFirst({
      where: { userId: user.id },
      include: {
        org: true,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization membership found" }, { status: 403 });
    }

    const { org } = membership;

    // Reset organization plan back to FREE (Stripe bypassed)
    await prisma.org.update({
      where: { id: org.id },
      data: {
        plan: "FREE",
        stripeSubscriptionId: null,
      },
    });

    return NextResponse.json({
      success: true,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?success=true`,
    });
  } catch (error: any) {
    console.error("Local portal management downgrade failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
