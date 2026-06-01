import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(
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
    const previewMode = searchParams.get("preview") === "true";

    const membership = await prisma.orgMember.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization membership found" }, { status: 403 });
    }

    // Fetch program details to confirm ownership
    const program = await prisma.program.findFirst({
      where: {
        id: params.id,
        orgId: membership.orgId,
      },
      include: {
        applicants: {
          include: {
            report: true,
            emailDelivery: true,
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const total = program.applicants.length;
    let ready = 0;
    let generating = 0;
    let error = 0;
    
    program.applicants.forEach((app) => {
      if (app.report) {
        if (app.report.status === "READY" || app.report.status === "SENT") {
          ready++;
        } else if (app.report.status === "GENERATING") {
          generating++;
        } else if (app.report.status === "ERROR") {
          error++;
        }
      } else {
        generating++; // Treats missing reports as pending compilation
      }
    });

    const percentComplete = total > 0 ? Math.round((ready / total) * 100) : 0;

    const data: any = {
      total,
      ready,
      generating,
      error,
      percentComplete,
      applicants: program.applicants.map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        status: a.status,
        reportStatus: a.report?.status || "GENERATING",
      })),
    };

    // 1. If previews are requested, load 5 randomly selected READY reports
    if (previewMode && ready > 0) {
      const readyApplicants = program.applicants.filter(
        (app) => app.report && app.report.status === "READY"
      );

      // Shuffle array and grab first 5 items
      const shuffled = [...readyApplicants].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);

      data.previews = selected.map((app) => ({
        applicantId: app.id,
        name: app.name,
        email: app.email,
        status: app.status,
        overallPercentile: app.report!.overallPercentile,
        summary: app.report!.summary,
        strengthHighlight: app.report!.strengthHighlight,
        criteriaBreakdown: app.report!.criteriaBreakdown,
        improvementAreas: app.report!.improvementAreas,
        nextSteps: app.report!.nextSteps,
      }));
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
