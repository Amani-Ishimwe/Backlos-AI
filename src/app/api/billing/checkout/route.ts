import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { STRIPE_PLANS } from "@/lib/stripe";
import { Plan } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    // Fetch organization associated with user
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

    // Direct local plan upgrade mapping (Stripe bypassed)
    let selectedPlan: Plan = "FREE";
    if (priceId === STRIPE_PLANS.STARTER.priceId) selectedPlan = "STARTER";
    else if (priceId === STRIPE_PLANS.GROWTH.priceId) selectedPlan = "GROWTH";
    else if (priceId === STRIPE_PLANS.SCALE.priceId) selectedPlan = "SCALE";

    await prisma.org.update({
      where: { id: org.id },
      data: {
        plan: selectedPlan,
        stripeSubscriptionId: `mock_sub_${Math.random().toString(36).substring(2, 9)}`,
      },
    });

    return NextResponse.json({
      success: true,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?success=true`,
    });
  } catch (error: any) {
    console.error("Local checkout upgrade failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
