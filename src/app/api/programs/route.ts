import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { ProgramType, Tone } from "@/types";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Locate org member
    const membership = await prisma.orgMember.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization membership found" }, { status: 403 });
    }

    const programs = await prisma.program.findMany({
      where: { orgId: membership.orgId },
      include: {
        criteria: true,
        applicants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: programs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { name, type, decisionDeadline, tonePreference } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Program Name is required" }, { status: 400 });
    }

    const membership = await prisma.orgMember.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "No active organization link found" }, { status: 403 });
    }

    const newProgram = await prisma.program.create({
      data: {
        orgId: membership.orgId,
        name,
        type: (type as ProgramType) || "HACKATHON",
        tonePreference: (tonePreference as Tone) || "FRIENDLY",
        decisionDeadline: decisionDeadline ? new Date(decisionDeadline) : null,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ success: true, data: newProgram }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
