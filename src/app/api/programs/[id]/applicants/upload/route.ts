import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const membership = await prisma.orgMember.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization membership found" }, { status: 403 });
    }

    // Verify program belongs to this organization
    const program = await prisma.program.findFirst({
      where: {
        id: params.id,
        orgId: membership.orgId,
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const { rows } = await request.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "No applicant rows provided" }, { status: 400 });
    }

    // Process each row sequentially without an interactive transaction —
    // PgBouncer's transaction pooling mode recycles connections between statements,
    // which invalidates long-running interactive transactions (Prisma error P2028).
    let created = 0;
    let updated = 0;

    for (const row of rows) {
      const { name, email, status, scores, judgeNotes } = row;

      // 1. Upsert applicant
      const existingApp = await prisma.applicant.findFirst({
        where: { programId: params.id, email },
      });

      let applicant;
      if (existingApp) {
        applicant = await prisma.applicant.update({
          where: { id: existingApp.id },
          data: { name, status },
        });
        updated++;
      } else {
        applicant = await prisma.applicant.create({
          data: {
            programId: params.id,
            name,
            email,
            status: status || "PENDING",
          },
        });
        created++;
      }

      // 2. Upsert scores per criteria
      if (scores && typeof scores === "object") {
        for (const criteriaId of Object.keys(scores)) {
          const scoreVal = parseFloat(scores[criteriaId]);
          await prisma.applicantScore.upsert({
            where: {
              applicantId_criteriaId: {
                applicantId: applicant.id,
                criteriaId,
              },
            },
            update: { score: scoreVal, judgeNotes: judgeNotes || null },
            create: {
              applicantId: applicant.id,
              criteriaId,
              score: scoreVal,
              judgeNotes: judgeNotes || null,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: { created, updated },
    });

  } catch (error: any) {
    console.error("Batch upload failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const applicantId = searchParams.get("applicantId");

    if (!applicantId) {
      return NextResponse.json({ error: "applicantId parameter is required" }, { status: 400 });
    }

    const membership = await prisma.orgMember.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization membership found" }, { status: 403 });
    }

    // Verify program belongs to this organization
    const program = await prisma.program.findFirst({
      where: {
        id: params.id,
        orgId: membership.orgId,
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Delete applicant
    await prisma.applicant.delete({
      where: {
        id: applicantId,
        programId: params.id,
      },
    });

    return NextResponse.json({ success: true, message: "Applicant deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
